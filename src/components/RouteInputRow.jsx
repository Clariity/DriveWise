import React, { useState, useContext, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { StoreContext, ActionType } from "../store";
import { locationLookup, reverseLocationLookup } from "../data";
import { useHistory } from "react-router-dom"
import { useSearchParams } from "../hooks"
import "../styles/RouteInput.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

export default function RouteInputRow({ direction }) {
  const [options, setOptions] = useState([]);
  const { state, dispatch } = useContext(StoreContext);
  const history = useHistory()
  const { params } = useSearchParams()

  // Remove focus from input
  useEffect(() => {
    document.activeElement.blur();
  }, []);

  const selected =
    direction === "to" ? state.routeToLocation : state.routeFromLocation;
  const type =
    direction === "to"
      ? ActionType.SET_ROUTE_TO_LOCATION
      : ActionType.SET_ROUTE_FROM_LOCATION;

  function handleInputChange(value) {
    if (value.length >= 1) {
      locationLookup(value)
        .then((json) =>
          json.features.map((option) => ({
            text: option.place_name,
            center: [option.center[1], option.center[0]],
          }))
        )
        .then((options) => setOptions(options));
    } else {
      setOptions([]);
    }
  }

  function handleSelectedChange(value) {
    // Update the store with the selected location for the route
    const location = value.length > 0 ? [value[0]] : [];
    const center = location.length > 0 ? location[0].center : null
    if (center === null) {
      params.delete(direction)
    } else {
      params.set(direction, JSON.stringify(center))
    }
    dispatch({ type, payload: location });
    history.push({
      pathname: "/",
      search: "?" + params.toString()
    })
    // We need to remember to clear the coordinates here so the markers are removed
    if (value.length === 0)
      dispatch({ type: ActionType.SET_ROUTE, payload: { coordinates: [], time: "" } });
  }

  function handleGeolocationButton() {
    reverseLocationLookup(state.userLocation).then((json) => {
      if (json.features.length >= 1) {
        const value = {
          text: json.features[0].place_name,
          center: state.userLocation,
        };
        params.set(direction, JSON.stringify(state.userLocation))
        dispatch({ type, payload: [value] });
        history.push({
          pathname: "/",
          search: "?" + params.toString()
        })
      }
    });
  }

  function handleAddLocation() {
    dispatch({
      type: ActionType.SET_MAP_MODE,
      payload: state.mapMode === "normal" ? `select-${direction}` : "normal"
    });
  }

  function getBlurClassName() {
    if (direction === "to")
      return state.mapMode === "select-to" ? "route-input-button unblur" : "route-input-button"
    else
      return state.mapMode === "select-from" ? "route-input-button unblur" : "route-input-button"
  }

  return (
    <div className="route-input-row">
      <Typeahead
        id={"route-input-" + direction}
        className="location-input"
        labelKey="text"
        options={options}
        selected={selected}
        onInputChange={handleInputChange}
        onChange={handleSelectedChange}
        placeholder={direction === "to" ? "Where to?" : "Where from?"}
        maxResults={5}
        autoFocus={true}
        selectHintOnEnter={true}
        minLength={4}
        clearButton={true}
      />
      <div className="button-group">
        <button
          className="route-input-button"
          onClick={() => handleGeolocationButton()}
          data-tip="Set point as current location"
        >
          <i className="material-icons">gps_fixed</i>
        </button>
        <button
          className={getBlurClassName()}
          onClick={() => handleAddLocation()}
          data-tip="Route Mode: Set point by clicking on map"
        >
          <i className="material-icons">add_location</i>
        </button>
      </div>
    </div>
  );
}
