import React, { useEffect } from "react";
import L from "leaflet";

export default function Marker({ map, point, color }) {
  const [x, y] = "$type" in point ? JSON.parse(point.point) : [parseFloat(point.latitude), point.longitude]
  const latLng = "$type" in point ? [y, x] : [x, y];
  useEffect(() => {
    const icon = L.icon({
      iconUrl: require(`../media/marker-icon-${color}.png`),
      iconSize: [25, 41], // size of the icon
      iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
      popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
      shadowSize: [41, 41], // size of the shadow
    });
    const marker = L.marker(latLng, {
      icon,
    });

    const startDateTime = new Date(point.overallStart)
    const endDateTime = new Date(point.overallEnd)

    if (map) {
      marker.addTo(map);
      marker.bindPopup(
        point.startEndTitle ||
        `<b>${point.title}</b> <br>
        ${point.category1} - ${point.category2} <br>
        Start: ${startDateTime} <br>
        End: ${endDateTime} <br><br>
        Technical Details: <br>
        Author: ${point.author} <br>
        GUID: ${point.guid || point.id} <br>
        Link: <a href="${point.link}" target="_blank" rel="noopener noreferrer">${point.link}</a> <br>
        Reference: ${point.reference}`
      );
    }

    return () => map.removeLayer(marker);
  }, [map, point, color, latLng]);

  return <></>;
}
//   return (
//     <Marker position={position} icon={icon}>
//       <Popup>
        // <b>{point.title}</b> <br />
        // {point.category1} - {point.category2} <br />
        // Description: {point.description} <br />
        // Start: {point.overallStart} <br />
        // End: {point.overallEnd} <br />
        // Technical Details: <br />
        // Author: {point.author} <br />
        // GUID: {point.guid} <br />
        // link: {point.link} <br />
        // reference {point.reference}
//       </Popup>
//     </Marker>
//   )
// }
