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
    Array.from(incident.children).reduce((acc, elem) => {
      let tagName = elem.tagName;
      // Handle multiple tags named category
      if (tagName === "category") {
        tagName = acc.hasOwnProperty("category1") ? "category2" : "category1";
      }
      return Object.assign(acc, { [tagName]: elem.innerHTML });
    }, {})
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
  const newHeIncidents = convertHeXmlToJson(incidentItems);

  const roadworksItems = heRoadworksXml.getElementsByTagName("item");
  const newRoadworks = convertHeXmlToJson(roadworksItems);

  // partition the new roadworks into current and planned
  const filter = (elem, startField, endField) =>
    new Date(elem[startField]) <= date && date <= new Date(elem[endField]);

  const [newHeRoadworksCurrent, newHeRoadworksPlanned] = newRoadworks.reduce(
    ([current, planned], elem) => {
      return filter(elem, "overallStart", "overallEnd")
        ? [[...current, elem], planned]
        : [current, [...planned, elem]];
    },
    [[], []]
  );

  // TODO there is definitely a cleaner way of doing this
  const newTflSevere = [],
    newTflCurrent = [],
    newTflPlanned = [];

  let pushToArray;
  for (let j = 0; j < tflJson.length; j++) {
    // loop through tfl data and add to respective arrays, will need to extract data we know we need at a later point, currently keeps everything
    pushToArray =
      tflJson[j].severity === "Severe"
        ? newTflSevere
        : filter(tflJson[j], "startDateTime", "endDateTime")
        ? newTflCurrent
        : newTflPlanned;
    pushToArray.push(tflJson[j]);
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
