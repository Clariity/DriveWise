import React, { useMemo, useContext, useEffect } from "react";
import LocationMarker from "./LocationMarker"
import Map from "./Map";
import Marker from "./Marker";
import RoutingMachine from "./RoutingMachine";
import { ActionType, StoreContext } from "../store";

const ky = 40000 / 360;

function arePointsNear(checkPoint, centerPoint, km) {
  const [checkLatitude, checkLongitude] = checkPoint;
  const [centerLatitude, centerLongitude] = centerPoint;

  const kx = Math.cos((Math.PI * centerLatitude) / 180.0) * ky;
  const dx = Math.abs(centerLongitude - checkLongitude) * kx;
  const dy = Math.abs(centerLatitude - checkLatitude) * ky;

  return Math.sqrt(dx * dx + dy * dy) <= km;
}

function isPointNear(point, coordinates) {
  for (const coord of coordinates) {
    const checkPoint = [coord.lat, Math.abs(coord.lng)];
    const centerPoint = [point.latitude, Math.abs(point.longitude)];
    if (arePointsNear(checkPoint, centerPoint, 0.1)) {
      return true;
    }
  }
  return false;
}

export default function MapWindow() {
  const { state, dispatch } = useContext(StoreContext);

  function isMarkerOnLocation() {
    if (state.routeFromLocation.length > 0)
      if(state.routeFromLocation[0].center[0] === state.userLocation[0] && state.routeFromLocation[0].center[1] === state.userLocation[1])
        return true
    if (state.routeToLocation.length > 0)
      if(state.routeToLocation[0].center[0] === state.userLocation[0] && state.routeToLocation[0].center[1] === state.userLocation[1])
        return true
    return false
  }

  const routeFromMarker =
    state.routeFromLocation.length > 0 ? (
      <Marker
        point={{
          latitude: state.routeFromLocation[0].center[0],
          longitude: state.routeFromLocation[0].center[1],
          startEndTitle: "<b>Starting Point: </b>" + state.routeFromLocation[0].text
        }}
        color={"blue"}
      />
    ) : (
      <></>
    );

  const routeToMarker =
    state.routeToLocation.length > 0 ? (
      <Marker
        point={{
          latitude: state.routeToLocation[0].center[0],
          longitude: state.routeToLocation[0].center[1],
          startEndTitle: "<b>Destination: </b>" + state.routeToLocation[0].text
        }}
        color={"blue"}
      />
    ) : (
      <></>
    );

  const locationMarker = 
    !isMarkerOnLocation() ? (
      <LocationMarker 
        point={{
          latitude: state.userLocation[0],
          longitude: state.userLocation[1]
        }}
      />
    ) : <></>

  // We make sure to only recompute the route roadworks when the coordinates (aka the route) changes
  const routeRoadworks = useMemo(() => {
    console.log("Recalculating route roadworks");
    const roadworks = state.heCurrent;
    const coordinates = state.routeCoordinates;

    return roadworks.filter((point) => {
      return isPointNear(point, coordinates);
    });
  }, [state.routeCoordinates, state.heCurrent]);

  // Updating any marker information when the filtered roadworks array changes
  useEffect(() => {
    // TODO: order routeRoadworks by date first (if not done already)
    // Note: This will need to be changed when more than heCurrent is added, a color needs to be passed as well so we can set the appropriate pin colour to be displayed in the route info section, currently is just manually showing orange
    dispatch({
      type: ActionType.SET_MARKER_INFO,
      payload: routeRoadworks,
    });
  }, [dispatch, routeRoadworks])

  return (
    <div className="map-window">
      <Map>
        <RoutingMachine />
        {locationMarker}
        {routeFromMarker}
        {routeToMarker}
        {routeRoadworks.map((roadwork) => (
          <Marker key={roadwork.guid} point={roadwork} color={"orange"} />
        ))}
      </Map>
    </div>
  );
}
