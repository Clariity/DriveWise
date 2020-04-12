import React, { useMemo, useContext } from "react";
import Map from "./Map";
import Marker from "./Marker";
import RoutingMachine from "./RoutingMachine";
import { StoreContext } from "../store";

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
  const { state } = useContext(StoreContext);

  // We make sure to only recompute the route roadworks when the coordinates (aka the route) changes
  const routeRoadworks = useMemo(() => {
    console.log("Recalculating route roadworks");
    const roadworks = state.heCurrent;
    const coordinates = state.routeCoordinates;

    return roadworks.filter((point) => {
      return isPointNear(point, coordinates);
    });
  }, [state.routeCoordinates, state.heCurrent]);

  return (
    <div className="map-window">
      <Map>
        <RoutingMachine />
        {routeRoadworks.map((roadwork) => (
          <Marker key={roadwork.guid} point={roadwork} color={"gold"} />
        ))}
      </Map>
    </div>
  );
}
