import { MAPBOX_API_KEY } from "./Keys";

const HighwaysEnglandUnplannedEvents =
  "https://m.highwaysengland.co.uk/feeds/rss/UnplannedEvents.xml";

const HighwaysEnglandCurrentEvents =
  "https://m.highwaysengland.co.uk/feeds/rss/CurrentAndFutureEvents.xml";

const TflDisruption = "https://api.tfl.gov.uk/Road/All/Disruption";

function getDates() {
  const date = new Date();
  const today = date.toISOString().split("T")[0];
  const nextWeekDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextWeek = nextWeekDate.toISOString().split("T")[0];

  return {
    date,
    today,
    nextWeekDate,
    nextWeek,
  };
}

function convertHeXmlToJson(htmlcollection) {
  return Array.from(htmlcollection).map((incident) =>
    getRoadworkObject(Array.from(incident.children).reduce((acc, elem) => {
      let tagName = elem.tagName;
      // Handle multiple tags named category
      if (tagName === "category") {
        tagName = acc.hasOwnProperty("category1") ? "category2" : "category1";
      }
      return Object.assign(acc, { [tagName]: elem.innerHTML });
    }, {}), "severe")
  );
}

export default async function fetchRoadworkData() {
  const { date, today, nextWeek } = getDates();

  console.log("Fetching data");
  const [
    heIncidentsResponse,
    heRoadworksResponse,
    tflResponse,
  ] = await Promise.all([
    fetch(HighwaysEnglandUnplannedEvents),
    fetch(HighwaysEnglandCurrentEvents),
    fetch(`${TflDisruption}?startDate=${today}&endDate=${nextWeek}`),
  ]);

  const [heIncidentsText, heRoadworksText, tflJson] = await Promise.all([
    heIncidentsResponse.text(),
    heRoadworksResponse.text(),
    tflResponse.json(),
  ]);

  // TODO there is maybe a better way to do this
  let parser, heIncidentsXml, heRoadworksXml;
  if (window.DOMParser) {
    // parse XML
    parser = new DOMParser();
    heIncidentsXml = parser.parseFromString(heIncidentsText, "text/xml");
    heRoadworksXml = parser.parseFromString(heRoadworksText, "text/xml");
  } else {
    // Internet Explorer
    heIncidentsXml = new window.ActiveXObject("Microsoft.XMLDOM");
    heRoadworksXml = new window.ActiveXObject("Microsoft.XMLDOM");
    heIncidentsXml.async = false;
    heRoadworksXml.async = false;
    heIncidentsXml.loadXML(heIncidentsText);
    heRoadworksXml.loadXML(heRoadworksText);
  }

  const incidentItems = heIncidentsXml.getElementsByTagName("item");
  const newHeIncidents = convertHeXmlToJson(incidentItems)
  console.log(newHeIncidents)

  const roadworksItems = heRoadworksXml.getElementsByTagName("item");
  const newRoadworks = convertHeXmlToJson(roadworksItems)

  // partition the new roadworks into current and planned
  const filter = (elem, startField, endField) =>
    new Date(elem[startField]) <= date && date <= new Date(elem[endField]);

  const [newHeRoadworksCurrent, newHeRoadworksPlanned] = newRoadworks.reduce(
    ([current, planned], elem) => {
      return filter(elem, "startDate", "endDate")
        ? [[...current, getRoadworkObject(elem, "current")], planned]
        : [current, [...planned, getRoadworkObject(elem, "planned")]];
    },
    [[], []]
  );

  // TODO there is definitely a cleaner way of doing this
  const newTflSevere = [],
    newTflCurrent = [],
    newTflPlanned = [];

  // loop through tfl data and add to respective arrays, will need to extract data we know we need at a later point, currently keeps everything
  for (const json of tflJson) {
    if (json.severity === "Severe") {
      newTflSevere.push(getRoadworkObject(json, "severe"))
    } else if (filter(json, "startDateTime", "endDateTime")) {
      newTflCurrent.push(getRoadworkObject(json, "current"))
    } else {
      newTflPlanned.push(getRoadworkObject(json, "planned"))
    }
  }

  return [
    newHeIncidents,
    newHeRoadworksCurrent,
    newHeRoadworksPlanned,
    newTflSevere,
    newTflCurrent,
    newTflPlanned,
  ];
}

export function locationLookup(value) {
  const uriValue = encodeURIComponent(value);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${uriValue}.json?country=GB&access_token=${MAPBOX_API_KEY}`;

  return fetch(url).then((results) => results.json());
}

export function reverseLocationLookup(coords) {
  const [latitude, longitude] = coords;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?country=GB&access_token=${MAPBOX_API_KEY}`;

  return fetch(url).then((result) => result.json());
}

export function getColor(roadwork) {
  const type = roadwork["__type"]
  switch (type) {
    case "severe": {
      return "red"
    }
    case "planned": {
      return "gold"
    }
    case "current": {
      return "orange"
    }
    default: {
      throw new Error(`Unknown roadwork ${type}`)
    }
  }
}

export function getRoadworkObject(roadwork, type) {
  const isTfl = "$type" in roadwork
  const [x, y] = isTfl ? JSON.parse(roadwork.point) : roadwork.latLng ? roadwork.latLng : [parseFloat(roadwork.latitude), parseFloat(roadwork.longitude)]
  return {
    startDate: roadwork.startDate || new Date(roadwork.overallStart || roadwork.startDateTime),
    endDate: roadwork.endDate || new Date(roadwork.overallEnd || roadwork.endDateTime),
    latLng: isTfl ? [y, x] : [x, y],
    title: roadwork.title || roadwork.location,
    category: roadwork.category1 || roadwork.category,
    subCategory: roadwork.category2 || roadwork.subCategory,
    author: roadwork.author || "TFL",
    id: roadwork.guid || roadwork.id,
    link: roadwork.link || `https://api.tfl.gov.uk/Road/All/Disruption${roadwork.url}`,
    reference: roadwork.reference,
    "__type": type
  }
}