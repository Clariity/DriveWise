import React, { useEffect } from "react";
import L from "leaflet";

export default function LocationMarker({ map, point }) {
  useEffect(() => {
    if(map) {
      const icon = L.icon({
        iconUrl: require("../media/location2.png"),
        iconSize: [30, 30], // size of the icon
        iconAnchor: [15, 20], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -15], // point from which the popup should open relative to the iconAnchor
        shadowSize: [30, 30], // size of the shadow
      });
      const marker = L.marker([point.latitude, point.longitude], {
        icon,
      });

      marker.addTo(map);
      marker.bindPopup("Your current location");

      // map.on('zoomend', function() {
      //   var currentZoom = map.getZoom();
      //   console.log(currentZoom)
      // })

      return () => map.removeLayer(marker);
    }
  }, [map, point]);

  return <></>;
}