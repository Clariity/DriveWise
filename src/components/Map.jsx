import React, { useRef, useEffect, useState, useContext } from "react";
import L from "leaflet";
import "leaflet-spin";
import { StoreContext, ActionType } from "../store";
import { reverseLocationLookup } from "../data";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import { useSearchParams } from "../hooks";

const spinnerOptions = {
  lines: 13, // The number of lines to draw
  length: 46, // The length of each line
  width: 6, // The line thickness
  radius: 51, // The radius of the inner circle
  scale: 0.7, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: "#ef772d", // CSS color or array of colors
  fadeColor: "transparent", // CSS color or array of colors
  speed: 1.7, // Rounds per second
  rotate: 0, // The rotation offset
  animation: "spinner-line-fade-more", // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: "spinner", // The CSS class to assign to the spinner
  top: "50%", // Top position relative to parent
  left: "50%", // Left position relative to parent
  shadow: "0 0 1px transparent", // Box-shadow for the lines
  position: "absolute", // Element positioning
};

export default function Map({ children }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const { state, dispatch } = useContext(StoreContext);
  const history = useHistory();
  const { params } = useSearchParams();
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "";

  // We intialise the map once on initial component render
  useEffect(() => {
    const map = L.map(mapRef.current, {
      minZoom: 6,
    });
    L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener noreferrer">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/" target="_blank" rel="noopener noreferrer">Improve this map</a>',
    }).addTo(map);
    setMap(map);
  }, []);

  // Center the map
  useEffect(() => {
    if (map) {
      if (state.routeFromLocation.length > 0) {
        map.setView(state.routeFromLocation[0].center, 12);
      } else {
        map.setView(state.userLocation, 12);
      }
    }
  }, [map, state.userLocation, state.routeFromLocation]);

  // update map reference
  useEffect(() => {
    dispatch({
      type: ActionType.SET_MAP_REFERENCE,
      payload: map,
    });
  }, [map, dispatch]);

  useEffect(() => {
    if (map) {
      map.on("click", ({ latlng }) => {
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
              params.set(
                state.mapMode === "select-from" ? "from" : "to",
                JSON.stringify(coords)
              );
              dispatch({ type, payload: [value] });
              history.push({
                pathname: isLocal ? "/" : "/DriveWise/", // change to "/" for localhost
                search: "?" + params.toString(),
              });
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

  useEffect(() => {
    if (map) {
      map.spin(state.mapSpinner, spinnerOptions);
    }
  }, [map, state.mapSpinner]);

  // We augment the children of this element with a prop that holds the map element, so that leaflet can access it
  const childrenWithMap = React.Children.map(children, (child) =>
    React.cloneElement(child, { map })
  );

  const opacity = state.mapSpinner ? "0.5" : "1";

  return (
    <div
      id={state.mapMode !== "normal" ? "crosshairs" : null}
      className="drivewise-map"
      ref={mapRef}
    >
      {childrenWithMap}
    </div>
  );
}
