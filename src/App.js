import React, { useEffect, useState } from "react";
import Route from "./components/Route";
import Map from "./components/Map";
import L from "leaflet";
import "./styles/App.css";

const HighwaysEnglandUnplannedEvents =
  "http://m.highwaysengland.co.uk/feeds/rss/UnplannedEvents.xml";

const HighwaysEnglandCurrentEvents =
  "http://m.highwaysengland.co.uk/feeds/rss/CurrentAndFutureEvents.xml";

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
    nextWeek
  };
}

function convertHeXmlToJson(htmlcollection) {
  return Array.from(htmlcollection).map(incident =>
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

export default () => {
  const [heIncidents, setHeIncidents] = useState([]); // Red Pins HE
  const [heRoadworksCurrent, setHeRoadworksCurrent] = useState([]); // Orange Pins HE
  const [heRoadworksPlanned, setHeRoadworksPlanned] = useState([]); // Yellow Pins HE
  const [tflSevere, setTflSevere] = useState([]); // Red Pins TFL
  const [tflCurrent, setTflCurrent] = useState([]); // Orange Pins TFL
  const [tflPlanned, setTflPlanned] = useState([]); // Yellow Pins TFL
  const [loadedData, setLoadedData] = useState(false); // Loading Data Flag to prevent reloads

  const [clientLocation, setClientLocation] = useState(null);
  // const [routeFrom, setRouteFrom] = useState(L.latLng(50.94, 0.264822));
  // const [routeTo, setRouteTo] = useState(L.latLng(50.954358, -0.134224));
  const [routeFrom, setRouteFrom] = useState(null);
  const [routeTo, setRouteTo] = useState(null);
  const [routeMode, setRouteMode] = useState("none");
  const [locationPicked, setLocationPicked] = useState(null);

  useEffect(() => {
    async function fetchXML() {
      //set to loaded once data is loaded, prevents infinte looping
      if (!loadedData) {
        const { date, today, nextWeek } = getDates();
        // fetch current HE incidents
        const heIncidentsFetch = fetch(HighwaysEnglandUnplannedEvents);
        // fetch current and planned HE roadworks
        const heRoadworksFetch = fetch(HighwaysEnglandCurrentEvents);
        // fetch current TFL disruptions, and current and planned TFL roadworks (default time frame 1 week)
        const tflFetch = fetch(
          `${TflDisruption}?startDate=${today}&endDate=${nextWeek}`
        );

        const [
          heIncidentsResponse,
          heRoadworksResponse,
          tflResponse
        ] = await Promise.all([heIncidentsFetch, heRoadworksFetch, tflFetch]);

        const [heIncidentsText, heRoadworksText, tflJson] = await Promise.all([
          heIncidentsResponse.text(),
          heRoadworksResponse.text(),
          tflResponse.json()
        ]);

        let newTflSevere = [],
          newTflCurrent = [],
          newTflPlanned = [];
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
          new Date(elem[startField]) <= date &&
          date <= new Date(elem[endField]);

        const [
          newHeRoadworksCurrent,
          newHeRoadworksPlanned
        ] = newRoadworks.reduce(
          ([current, planned], elem) => {
            return filter(elem, "overallStart", "overallEnd")
              ? [[...current, elem], planned]
              : [current, [...planned, elem]];
          },
          [[], []]
        );

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

        setHeIncidents(newHeIncidents);
        setHeRoadworksCurrent(newHeRoadworksCurrent);
        setHeRoadworksPlanned(newHeRoadworksPlanned);
        setTflSevere(newTflSevere);
        setTflCurrent(newTflCurrent);
        setTflPlanned(newTflPlanned);
        setLoadedData(true); //data is now loaded, set to loaded to prevent re-download of data
      }
    }
    fetchXML();
  }, [loadedData]);

  // fetch client location
  useEffect(() => {
    // prevent continuous location fetching
    if (clientLocation === null) {
      const setCurrentPosition = position =>
        setClientLocation([
          position.coords.latitude,
          position.coords.longitude
        ]);
      const positionError = err => {
        console.log(err);
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          setCurrentPosition,
          positionError,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
          }
        );
      }
    }
  });

  // printing data to view in development
  // if (loadedData) {
  //   console.log(
  //     "HE Incidents: ", heIncidents,
  //     "HE Roadworks Current: ", heRoadworksCurrent,
  //     "HE Roadworks Planned: ", heRoadworksPlanned,
  //     "TFL Severe: ", tflSevere,
  //     "TFL Current: ", tflCurrent,
  //     "TFL Planned: ", tflPlanned
  //   );
  //   // console.log(clientLocation)
  // }

  const handleRouteChange = (direction, value) => {
    if (direction === "to") {
      setLocationPicked(value);
      setRouteTo(L.latLng(value[0].latlng[0], value[0].latlng[1]));
    } else {
      setLocationPicked(value);
      setRouteFrom(L.latLng(value[0].latlng[0], value[0].latlng[1]));
    }
  };

  let markers = {
    heIncidents,
    heRoadworksCurrent,
    heRoadworksPlanned,
    tflSevere,
    tflCurrent,
    tflPlanned
  }

  return (
    <div className="App">
      <Route
        handleRouteChange={handleRouteChange}
        routeMode={routeMode}
        setRouteMode={setRouteMode}
        locationPicked={locationPicked}
        setLocationPicked={setLocationPicked}
      />
      <Map
        handleRouteChange={handleRouteChange}
        routeMode={routeMode}
        setRouteMode={setRouteMode}
        currentPosition={clientLocation}
        from={routeFrom}
        to={routeTo}
        markers={markers}
      />
    </div>
  );
};
