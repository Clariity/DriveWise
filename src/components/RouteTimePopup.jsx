import React, { useEffect } from "react";
import L from "leaflet";

function parseTime(routeTime) {
  return new Date(routeTime * 1000).toISOString().substr(11, 8);
}

export default function RouteTimePopup({ map, point, content }) {
  useEffect(() => {
    if(map) {
      L.popup({ closeOnClick: false }).setLatLng(point).setContent(`Route time: ${parseTime(content)}`).openOn(map)

      return () => map.closePopup()
    }
  }, [map, point, content])

  return <></>;
}