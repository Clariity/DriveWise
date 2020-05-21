import React, { useContext } from "react";
import { StoreContext, ActionType } from "../store";
import "../styles/RouteInfoBox.css"

function parseTime(routeTime) {
  return new Date(routeTime * 1000).toISOString().substr(11, 8);
}

export default function RouteInfoBox() {
  const { state, dispatch } = useContext(StoreContext);
  const severeTicked = !state.roadworkFilter.includes("severe")
  const currentTicked = !state.roadworkFilter.includes("current")
  const plannedTicked = !state.roadworkFilter.includes("planned")

  function handleCheckChange(event) {
    const { value, checked } = event.target
    // If the box is now checked, we need to remove that key from the filter
    const actionType = checked ? ActionType.REMOVE_ROADWORK_FILTER : ActionType.ADD_ROADWORK_FILTER
    dispatch({ type: actionType, payload: value })
  }


  return (
    <div className="route-info-box">
      <h3>Route details</h3>
      <div>
        <p>Found {state.markerInfo.length} roadworks on route</p>
        <p>Estimtated route time: {parseTime(state.routeTime)}</p>
      </div>
      <h4>Filter roadworks</h4>
      <div className="checkbox-row">
        <div>
          <label htmlFor="severe">Severe</label>
          <input type="checkbox" value="severe" name="severe" checked={severeTicked} onChange={handleCheckChange} />
        </div>
        <div>
          <label htmlFor="current">Current</label>
          <input type="checkbox" value="current" name="current" checked={currentTicked} onChange={handleCheckChange} />
        </div>
        <div>
          <label htmlFor="planned">Planned</label>
          <input type="checkbox" value="planned" name="planned" checked={plannedTicked} onChange={handleCheckChange} />
        </div>
      </div>
    </div>
  )
}