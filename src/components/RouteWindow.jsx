import React, { useContext } from "react";
import RouteInputRow from "./RouteInputRow";
import { StoreContext, ActionType } from "../store";

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
      <div className="route-input-group">
        { state.mapMode !== "normal" && <div className="blur"/> }
        <RouteInputRow direction="from" />
        <RouteInputRow direction="to" />
      </div>
      { state.mapMode === "normal"
        ? <div className="route-info">
            <h1>Journey, Incident and Road Work Information Will Go Here</h1>
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
