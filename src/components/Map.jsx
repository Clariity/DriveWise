import React, { useRef, useEffect, useState, useContext } from "react";
import L from "leaflet";
import { StoreContext } from "../store";

export default function Map({ children }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const { state } = useContext(StoreContext);

  // We intialise the map once on initial component render
  useEffect(() => {
    const map = L.map(mapRef.current);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);
    setMap(map);
  }, []);

  // Every time the map reference, center or zoom level changes we adjust the map
  useEffect(() => {
    if (map) {
      map.setView(state.mapCenter, state.mapZoom);
    }
  }, [map, state.mapCenter, state.mapZoom]);

  const childrenWithMap = React.Children.map(children, (child) =>
    React.cloneElement(child, { map })
  );

  // We augment the children of this element with a prop that holds the map element, so that leaflet can access it
  return (
    <div className="drivewise-map" ref={mapRef}>
      {childrenWithMap}
    </div>
  );
}

// import React, { useEffect, useState, useMemo } from "react";
// import { Map, TileLayer } from "react-leaflet";
// import { MAPBOX_API_KEY } from "../Keys";
// import Marker from "./Marker";
// import Swal from "sweetalert2";
// import Routing from "./RoutingMachine";

// export default function DrivewiseMap({
//   handleRouteChange,
//   routeMode,
//   setRouteMode,
//   currentPosition,
//   from,
//   to,
//   markers,
// }) {
//   const [position, setPosition] = useState(currentPosition || [53.93, -4.21]); //lat, lon
//   const [zoom, setZoom] = useState(7);
//   const [isMapInit, setIsMapInit] = useState(false);
//   const [map, setMap] = useState(null);
//   const [coordinates, setCoordinates] = useState([]);

//   useEffect(() => {
//     console.log("Start of position and zoom effect in Map.js");
//     setPosition(currentPosition);
//     setZoom(15);
//     console.log("Position and zoom effect complete");
//   }, [currentPosition]);

//   useEffect(() => {
//     // setZoom(1)
//     if (from !== null && to !== null)
//       setPosition([(from.lat + to.lat) / 2, (from.lng + to.lng) / 2]);
//   }, [from, to]);

//   const saveMap = (map) => {
//     setMap(map);
//     setIsMapInit(true);
//   };

//   const handleClick = async (e) => {
//     if (routeMode !== "none") {
//       const clickedLocation = await fetch(
//         "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
//           e.latlng.lng +
//           "," +
//           e.latlng.lat +
//           ".json?country=GB&types=address&access_token=" +
//           MAPBOX_API_KEY
//       );
//       const clickedLocationJson = await clickedLocation.json();
//       console.log(clickedLocationJson);
//       if (clickedLocationJson.features.length >= 1)
//         handleRouteChange(routeMode, [
//           {
//             text: clickedLocationJson.features[0].place_name,
//             latlng: [e.latlng.lat, e.latlng.lng],
//           },
//         ]);
//       else {
//         Swal.fire({
//           icon: "error",
//           title: "No Address Found",
//           text:
//             "No address found in the selected location, please try a new location.",
//         });
//       }
//     } else {
//       //drop a pin / change dropped pin location (maybe always just set as to location?)
//     }
//   };

//   const plannedRoadworksOnRoute = useMemo(() => {
//     console.log("Recalculating planned on route roadworks with coordinates");
//     console.log(coordinates)
//     return markers.heRoadworksPlanned
//       .filter((point) => {
//         const ky = 40000 / 360;
//         function arePointsNear(checkPoint, centerPoint, km) {
//           var kx = Math.cos((Math.PI * centerPoint.lat) / 180.0) * ky;
//           var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
//           var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
//           return Math.sqrt(dx * dx + dy * dy) <= km;
//         }
//         const isPointNear = (point) => {
//           // console.log(`Checking if coordinates are near point ${point}`);
//           for (let c in coordinates) {
//             if (
//               arePointsNear(
//                 { lat: coordinates[c].lat, lng: Math.abs(coordinates[c].lng) },
//                 { lat: point.latitude, lng: Math.abs(point.longitude) },
//                 0.1
//               )
//             ) {
//               return true;
//             }
//           }
//           return false;
//         };
//         return isPointNear(point);
//       })
//       .map((point, index) => (
//         <Marker
//           position={[point.latitude, point.longitude]}
//           key={"key" + point.latitude + point.longitude + index}
//           colour={"gold"}
//           point={point}
//         />
//       ));
//   }, [coordinates]);

//   const mapChildren = (
//     <>
//       <TileLayer
//         attribution="&amp;copy <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &amp;copy <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
//         url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
//       />
//       {/* { markers.heIncidents.map((point, index) => { // ADD AN ONCLICK TO THE MARKERS THAT CHANGE THE MAP CENTER AND ZOOM IN ON THEM, however if they are clicking on them then its already on their screen so no point in zooming in? maybe on double click?
//           return  <Marker position={[point.latitude, point.longitude]} key={"key" + point.latitude + point.longitude + index} colour={"red"} point={point}/>
//         })
//       }
//       { markers.heRoadworksCurrent.map((point, index) => {
//           return  <Marker position={[point.latitude, point.longitude]} key={"key" + point.latitude + point.longitude + index} colour={"orange"} point={point}/>
//         })
//       } */}
//       {plannedRoadworksOnRoute}
//       {/* { markers.tflSevere.map((point, index) => {
//           return  <Marker position={[JSON.parse(point.point)[1], JSON.parse(point.point)[0]]} key={point.point + index} colour={"red"} point={point}/>
//         })
//       }
//       { markers.tflCurrent.map((point, index) => {
//           return  <Marker position={[JSON.parse(point.point)[1], JSON.parse(point.point)[0]]} key={point.point + index} colour={"orange"} point={point}/>
//         })
//       }
//       { markers.tflPlanned.map((point, index) => {
//           return  <Marker position={[JSON.parse(point.point)[1], JSON.parse(point.point)[0]]} key={point.point + index} colour={"gold"} point={point}/>
//         })
//       } */}
//       {isMapInit && (
//         <Routing
//           map={map}
//           from={from}
//           to={to}
//           setCoordinates={setCoordinates}
//         />
//       )}
//     </>
//   );

//   // console.log(coordinates)

//   return routeMode === "none" ? (
//     <Map
//       className={"map map" + routeMode}
//       center={position}
//       zoom={zoom}
//       ref={saveMap}
//       onClick={handleClick}
//     >
//       {mapChildren}
//     </Map>
//   ) : (
//     <Map
//       className={"map map" + routeMode}
//       center={position}
//       zoom={zoom}
//       ref={saveMap}
//       onClick={handleClick}
//       onContextMenu={() => setRouteMode("none")}
//     >
//       {mapChildren}
//     </Map>
//   );
// }
