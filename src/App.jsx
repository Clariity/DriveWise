import React, { useContext, useEffect } from "react";
import RouteWindow from "./components/RouteWindow";
import MapWindow from "./components/MapWindow";
import { StoreContext, ActionType } from "./store";
import fetchRoadworksData from "./data";
import { useGeolocation } from "./hooks";
import "./styles/App.css";
import "leaflet/dist/leaflet.css";

export default function App() {
  const { dispatch } = useContext(StoreContext);
  // Prompt for geolocation on first component render
  const [location, locationError] = useGeolocation();

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

  useEffect(() => {
    if (locationError === null && location.length > 0) {
      dispatch({
        type: ActionType.SET_MAP_CENTER,
        payload: location,
      });
      dispatch({ type: ActionType.SET_MAP_ZOOM, payload: 12 });
    }
    // React guarantees that dispatch is always the same, so we can put it in the deps array
    // to appease the linter and safely know it will never refire the effect
    // https://reactjs.org/docs/hooks-reference.html#usereducer
  }, [dispatch, location, locationError]);

  return (
    <div className="App">
      <RouteWindow />
      <MapWindow />
    </div>
  );
}
