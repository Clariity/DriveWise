import React, { useContext, useEffect } from "react";
import AppBar from "./components/AppBar";
import RouteWindow from "./components/RouteWindow";
import MapWindow from "./components/MapWindow";
import { StoreContext, ActionType } from "./store";
import { fetchRoadworkData, reverseLocationLookup } from "./data";
import { useGeolocation, useSearchParams } from "./hooks";
import ReactTooltip from "react-tooltip";
import "./styles/App.css";
import "./styles/Responsive.css";
import "leaflet/dist/leaflet.css";

export default function App() {
  const { dispatch } = useContext(StoreContext);
  // Prompt for geolocation on first component render
  const [location, locationError] = useGeolocation();
  const { params } = useSearchParams()

  useEffect(() => {
    dispatch({ type: ActionType.SET_MAP_SPINNER, payload: true })
    fetchRoadworkData().then((data) => {
      dispatch({ type: ActionType.SET_ROADWORKS_DATA, payload: data });
      dispatch({ type: ActionType.SET_MAP_SPINNER, payload: false })
    });
    const from = params.get("from")
    if (from) {
      reverseLocationLookup(JSON.parse(from)).then((json) => {
        if (json.features.length >= 1) {
          const value = {
            text: json.features[0].place_name,
            center: JSON.parse(from),
          };
          dispatch({ type: ActionType.SET_ROUTE_FROM_LOCATION, payload: [value] })
        }
      });
    }
    const to = params.get("to")
    if (to) {
      reverseLocationLookup(JSON.parse(to)).then((json) => {
        if (json.features.length >= 1) {
          const value = {
            text: json.features[0].place_name,
            center: JSON.parse(to),
          };
          dispatch({ type: ActionType.SET_ROUTE_TO_LOCATION, payload: [value] })
        }
      });
    }
    // React guarantees that dispatch is always the same, so we can put it in the deps array
    // to appease the linter and safely know it will never refire the effect
    // https://reactjs.org/docs/hooks-reference.html#usereducer
  }, [dispatch]);

  useEffect(() => {
    if (locationError === null && location.length > 0) {
      dispatch({
        type: ActionType.SET_USER_LOCATION,
        payload: location,
      });
    }
    // React guarantees that dispatch is always the same, so we can put it in the deps array
    // to appease the linter and safely know it will never refire the effect
    // https://reactjs.org/docs/hooks-reference.html#usereducer
  }, [dispatch, location, locationError]);

  return (
    <div className='app-container'>
      <AppBar />
      <ReactTooltip delayShow={500} />
      <div className="App">
        <RouteWindow />
        <MapWindow />
      </div>
    </div>
  );
}
