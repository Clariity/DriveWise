import React, { useRef, useEffect, useState, useContext } from "react";
import L from "leaflet";
import { StoreContext, ActionType } from "../store";
import { reverseLocationLookup } from "../data";
import Swal from 'sweetalert2'

export default function Map({ children }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const { state, dispatch } = useContext(StoreContext);

  // We intialise the map once on initial component render
  useEffect(() => {
    const map = L.map(mapRef.current, {
      minZoom: 6
    });
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener noreferrer">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/" target="_blank" rel="noopener noreferrer">Improve this map</a>'
    }).addTo(map);
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
              dispatch({
                type: ActionType.SET_MAP_MODE,
                payload: "normal",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "No Address Found",
                text:
                  "No address found in the selected location, please try a new location.",
              });
            }
          });
        } else {
          //drop a pin / change dropped pin location (maybe always just set as to location?)
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
    <div id={state.mapMode !== "normal" ? "crosshairs" : null} className="drivewise-map" ref={mapRef}>
      {childrenWithMap}
    </div>
  );
}