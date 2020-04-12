import React, { useState, useContext, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { StoreContext, ActionType } from "../store";
import { locationLookup, reverseLocationLookup } from "../data";
import "../styles/RouteInput.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

export default function RouteInputRow({ direction }) {
  const [options, setOptions] = useState([]);
  const { state, dispatch } = useContext(StoreContext);

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
    // Only fire search after 4 characters
    if (value.length >= 4) {
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
    dispatch({ type, payload: location });
  }

  function handleGeolocationButton() {
    reverseLocationLookup(state.userLocation).then((json) => {
      if (json.features.length >= 1) {
        const value = {
          text: json.features[0].place_name,
          center: state.userLocation,
        };
        dispatch({ type, payload: [value] });
      }
    });
  }

  function handleAddLocation() {
    dispatch({
      type: ActionType.SET_MAP_MODE,
      payload: `select-${direction}`,
    });
  }

  function handleClearLocation() {
    dispatch({ type, payload: [] });
    // We need to remember to clear the coordinates here so the markers are removed
    dispatch({ type: ActionType.SET_ROUTE_COORDINATES, payload: [] });
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
      />
      <div className="button-group">
        <button
          className="route-input-button"
          onClick={() => handleGeolocationButton()}
        >
          <i className="material-icons">gps_fixed</i>
        </button>
        <button
          className="route-input-button"
          onClick={() => handleAddLocation()}
        >
          <i className="material-icons">add_location</i>
        </button>
        <button
          className="route-input-button"
          onClick={() => handleClearLocation()}
        >
          <i className="material-icons">clear</i>
        </button>
      </div>
    </div>
  );
}
