import React, { useContext } from "react";
import RouteInputRow from "./RouteInputRow";
import { StoreContext, ActionType } from "../store";
import DatePicker from "./DatePicker";
import MarkerInfo from "./MarkerInfo";
import { getColor } from "../data"

export default function RouteWindow() {
  const { state, dispatch } = useContext(StoreContext);

  function setNormalMapMode() {
    dispatch({
      type: ActionType.SET_MAP_MODE,
      payload: `normal`,
    });
  }

  return (
    <div className="route-window">
      <div className="route-inputs">
        <div className="route-input-group">
          { state.mapMode !== "normal" && <div className="blur"/> }
          <RouteInputRow direction="from" />
          <RouteInputRow direction="to" />
        </div>
        <div className="route-input-group date-input-group">
          { state.mapMode !== "normal" && <div className="blur"/> }
          <DatePicker dateType="Start" />
          <DatePicker dateType="End" />
        </div>
      </div>
      { state.mapMode === "normal"
        ? <div className="route-info">
            {state.markerInfo.length === 0 && <p>Once a route has been selected, any identified incident and road work information for the selected route will appear here. <br/><br/> If a route has been selected and this message is still shown then there are no known incidents or current/planned road works on the selected route.</p>}
            {state.markerInfo.map(roadwork => (
              <MarkerInfo key={"markerInfo" + (roadwork.guid || roadwork.id)} info={roadwork} color={getColor(roadwork["__type"])} />
            ))}
          </div>
        : <div onClick={setNormalMapMode} className="route-mode-info">
            <h1>Route Select Mode: {state.mapMode === "select-to" ? " Destination" : " Starting Point"}</h1>
             <p>Click a location on the map to select it as your {state.mapMode === "select-to" ? "destination" : "starting point"}.</p>
             <p>To exit Route Select Mode, click within the dashed section here.</p> 
          </div>
      }
    </div>
  );
}
