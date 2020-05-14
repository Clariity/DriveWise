import React, { useContext, useEffect } from "react";
import AppBar from "./components/AppBar";
import RouteWindow from "./components/RouteWindow";
import MapWindow from "./components/MapWindow";
import { StoreContext, ActionType } from "./store";
import fetchRoadworksData from "./data";
import { useGeolocation } from "./hooks";
import ReactTooltip from "react-tooltip";
import "./styles/App.css";
import "./styles/Responsive.css";
import "leaflet/dist/leaflet.css";

export default function App() {
  const { dispatch } = useContext(StoreContext);
  // Prompt for geolocation on first component render
  const [location, locationError] = useGeolocation();

  useEffect(() => {
    dispatch({ type: ActionType.SET_MAP_SPINNER, payload: true })
    fetchRoadworksData().then((data) => {
      dispatch({ type: ActionType.SET_ROADWORKS_DATA, payload: data });
      dispatch({ type: ActionType.SET_MAP_SPINNER, payload: false })
    });
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
      <ReactTooltip delayShow={500}/>
      <div className="App">
        <RouteWindow />
        <MapWindow />
      </div>
    </div>
  );
}
