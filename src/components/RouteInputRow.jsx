import React, { useState, useContext, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { StoreContext, ActionType } from "../store";
import { MAPBOX_API_KEY } from "../Keys";
import "../styles/RouteInput.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { useGeolocation } from "../hooks";

export default function RouteInputRow({ direction }) {
  const [options, setOptions] = useState([]);
  const { state, dispatch } = useContext(StoreContext);
  const [userLocation, locationError] = useGeolocation();

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
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        value
      )}.json?country=GB&access_token=${MAPBOX_API_KEY}`;
      fetch(url)
        .then((results) => results.json())
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
    console.log(value);
    // Update the store with the selected location for the route
    const location = value.length > 0 ? [value[0]] : null;
    dispatch({ type, payload: location });
  }

  function handleGeolocationButton() {
    const [latitude, longitude] = userLocation;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?country=GB&access_token=${MAPBOX_API_KEY}`;
    fetch(url)
      .then((result) => result.json())
      .then((json) => {
        console.log(json);
        if (json.features.length >= 1) {
          const value = {
            text: json.features[0].place_name,
            center: userLocation,
          };
          handleSelectedChange([value]);
        }
      });
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
          className="use-geolocation-button"
          onClick={() => handleGeolocationButton()}
        >
          <i className="material-icons">gps_fixed</i>
        </button>
        <button
          className="clear-location-button"
          onClick={() => handleSelectedChange([])}
        >
          <i className="material-icons">clear</i>
        </button>
      </div>
    </div>
  );
}
