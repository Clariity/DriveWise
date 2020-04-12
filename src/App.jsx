import React, { useContext, useEffect } from "react";
import RouteWindow from "./components/RouteWindow";
import MapWindow from "./components/MapWindow";
import { StoreContext, ActionType } from "./store";
import fetchRoadworksData from "./data";
import "./styles/App.css";

export default function App() {
  const { dispatch } = useContext(StoreContext);

  useEffect(() => {
    fetchRoadworksData().then((data) => {
      dispatch({ type: ActionType.SET_HE_INCIDENTS, payload: data[0] });
      dispatch({ type: ActionType.SET_HE_CURRENT, payload: data[1] });
      dispatch({ type: ActionType.SET_HE_PLANNED, payload: data[2] });
    });
    // React guarantees that dispatch is always the same, so we can put it in the deps array
    // to appease the linter and safely know it will never refire the effect
    // https://reactjs.org/docs/hooks-reference.html#usereducer
  }, [dispatch]);

  // Prompt for geolocation on first component render
  useEffect(() => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      };
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          dispatch({
            type: ActionType.SET_MAP_CENTER,
            payload: [coords.latitude, coords.longitude],
          });
          dispatch({ type: ActionType.SET_MAP_ZOOM, payload: 12 });
        },
        // TODO handle code 1 - denied, code 2 - invalid, code 3 - timeout
        (error) => console.error(error),
        options
      );
    }
    // React guarantees that dispatch is always the same, so we can put it in the deps array
    // to appease the linter and safely know it will never refire the effect
    // https://reactjs.org/docs/hooks-reference.html#usereducer
  }, [dispatch]);

  return (
    <div className="App">
      <RouteWindow />
      <MapWindow />
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import Route from "./components/Route";
// import Map from "./components/Map";
// import L from "leaflet";
// import "./styles/App.css";

// export default function App() {
//   const [heIncidents, setHeIncidents] = useState([]); // Red Pins HE
//   const [heRoadworksCurrent, setHeRoadworksCurrent] = useState([]); // Orange Pins HE
//   const [heRoadworksPlanned, setHeRoadworksPlanned] = useState([]); // Yellow Pins HE
//   const [tflSevere, setTflSevere] = useState([]); // Red Pins TFL
//   const [tflCurrent, setTflCurrent] = useState([]); // Orange Pins TFL
//   const [tflPlanned, setTflPlanned] = useState([]); // Yellow Pins TFL

//   const [clientLocation, setClientLocation] = useState(null);
//   // const [routeFrom, setRouteFrom] = useState(L.latLng(50.94, 0.264822));
//   // const [routeTo, setRouteTo] = useState(L.latLng(50.954358, -0.134224));
//   const [routeFrom, setRouteFrom] = useState(null);
//   const [routeTo, setRouteTo] = useState(null);
//   const [routeMode, setRouteMode] = useState("none");
//   const [locationPicked, setLocationPicked] = useState(null);

//   // What is the application flow
//   // We need to load the data on page load - this can be done in a single effect on the App component for now
//   // This effect has no dependencies since we only want to load the data one time for now

//   useEffect(() => {
//     console.log("Start of main effect in App.js");
//
//     console.log("Main effect complete");
//   }, []);

//   // We want to ask for location on initial page load, and never again (for now)
//   useEffect(() => {
//     console.log("Start of geolocation effect in App.js");
//     if (navigator.geolocation) {
//       const options = {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 0,
//       };
//       navigator.geolocation.getCurrentPosition(
//         ({ coords }) => setClientLocation([coords.latitude, coords.longitude]),
//         // For now we will just set null on each code
//         // TODO handle code 1 - denied, code 2 - invalid, code 3 - timeout
//         (error) => setClientLocation(null),
//         options
//       );
//     }
//     console.log("Geolocation effect complete");
//   }, []);

//   // printing data to view in development
//   // if (loadedData) {
//   //   console.log(
//   //     "HE Incidents: ", heIncidents,
//   //     "HE Roadworks Current: ", heRoadworksCurrent,
//   //     "HE Roadworks Planned: ", heRoadworksPlanned,
//   //     "TFL Severe: ", tflSevere,
//   //     "TFL Current: ", tflCurrent,
//   //     "TFL Planned: ", tflPlanned
//   //   );
//   //   // console.log(clientLocation)
//   // }

//   const handleRouteChange = (direction, value) => {
//     setLocationPicked(value);
//     if (direction === "to") {
//       setRouteTo(L.latLng(value[0].latlng[0], value[0].latlng[1]));
//     } else {
//       setRouteFrom(L.latLng(value[0].latlng[0], value[0].latlng[1]));
//     }
//   };

//   let markers = {
//     heIncidents,
//     heRoadworksCurrent,
//     heRoadworksPlanned,
//     tflSevere,
//     tflCurrent,
//     tflPlanned,
//   };

//   return (
//     <div className="App">
//       <Route
//         handleRouteChange={handleRouteChange}
//         routeMode={routeMode}
//         setRouteMode={setRouteMode}
//         locationPicked={locationPicked}
//         setLocationPicked={setLocationPicked}
//       />
//       <Map
//         handleRouteChange={handleRouteChange}
//         routeMode={routeMode}
//         setRouteMode={setRouteMode}
//         currentPosition={clientLocation}
//         from={routeFrom}
//         to={routeTo}
//         markers={markers}
//       />
//     </div>
//   );
// };
