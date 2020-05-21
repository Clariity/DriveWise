import React, { useContext } from "react";
import { StoreContext, ActionType } from "../store";
import "../styles/RouteInfoBox.css";

function parseTime(routeTime) {
  return new Date(routeTime * 1000).toISOString().substr(11, 8);
}

export default function RouteInfoBox() {
  const { state, dispatch } = useContext(StoreContext);
  const severeTicked = !state.roadworkFilter.includes("severe");
  const currentTicked = !state.roadworkFilter.includes("current");
  const plannedTicked = !state.roadworkFilter.includes("planned");

  function handleCheckChange(event) {
    const { value, checked } = event.target;
    // If the box is now checked, we need to remove that key from the filter
    const actionType = checked
      ? ActionType.REMOVE_ROADWORK_FILTER
      : ActionType.ADD_ROADWORK_FILTER;
    dispatch({ type: actionType, payload: value });
  }

  return (
    <div className="route-info-box">
      <h3>Route details</h3>
      <div>
        <p>Found {state.markerInfo.length} roadworks or incidents on route</p>
        <p>Estimtated route time: {parseTime(state.routeTime)}</p>
      </div>
      <h4>Filter roadworks</h4>
      <div className="checkbox-row">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="checkbox"
            value="severe"
            id="severe"
            name="severe"
            checked={severeTicked}
            onChange={handleCheckChange}
          />
          <label htmlFor="severe">
            Severe
            <img
              className="marker-icon-image"
              src={"./media/marker-icon-red.png"}
              alt="severe marker colour"
            />
          </label>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="checkbox"
            value="current"
            id="current"
            name="current"
            checked={currentTicked}
            onChange={handleCheckChange}
          />
          <label htmlFor="current">
            Current
            <img
              className="marker-icon-image"
              src={"./media/marker-icon-orange.png"}
              alt="current marker colour"
            />
          </label>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="checkbox"
            value="planned"
            id="planned"
            name="planned"
            checked={plannedTicked}
            onChange={handleCheckChange}
          />
          <label htmlFor="planned">
            Planned
            <img
              className="marker-icon-image"
              src={"./media/marker-icon-gold.png"}
              alt="planned marker colour"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
