import React, { useRef, useEffect, useState, useContext } from "react";
import L from "leaflet";
import { StoreContext, ActionType } from "../store";
import { reverseLocationLookup } from "../data";

export default function Map({ children }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const { state, dispatch } = useContext(StoreContext);

  // We intialise the map once on initial component render
  useEffect(() => {
    const map = L.map(mapRef.current);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);

    setMap(map);
  }, []);

  // Center the map
  useEffect(() => {
    if (map) {
      map.setView(state.userLocation, 12);
    }
  }, [map, state.userLocation]);

  useEffect(() => {
    if (map) {
      map.on("click", ({latlng}) => {
        if (state.mapMode !== "normal") {
          const coords = [latlng.lat, latlng.lng];
          const type =
            state.mapMode === "select-from"
              ? ActionType.SET_ROUTE_FROM_LOCATION
              : ActionType.SET_ROUTE_TO_LOCATION;
          reverseLocationLookup(coords).then((json) => {
            if (json.features.length >= 1) {
              const value = {
                text: json.features[0].place_name,
                center: coords,
              };
              dispatch({ type, payload: [value] });
            }
          });
        }
      });
      return () => map.off("click");
    }
  }, [dispatch, map, state.mapMode]);

  // We augment the children of this element with a prop that holds the map element, so that leaflet can access it
  const childrenWithMap = React.Children.map(children, (child) =>
    React.cloneElement(child, { map })
  );

  return (
    <div className="drivewise-map" ref={mapRef}>
      {childrenWithMap}
    </div>
  );
}
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
