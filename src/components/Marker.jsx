import React, { useEffect } from "react";
import L from "leaflet";

export default function Marker({ map, point, color }) {
  useEffect(() => {
    const icon = L.icon({
      iconUrl: require(`../media/marker-icon-${color}.png`),
      iconSize: [25, 41], // size of the icon
      iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
      popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
      shadowSize: [41, 41], // size of the shadow
    });
    const marker = L.marker(point.latLng, {
      icon,
    });

    const startDateTime = new Date(point.startDate)
    const endDateTime = new Date(point.endDate)

    if (map) {
      marker.addTo(map);
      marker.bindPopup(
        point.startEndTitle ||
        `<div style="overflow-x: scroll"><b>${point.title}</b> <br>
        ${point.category} - ${point.subCategory} <br>
        Start: ${startDateTime} <br>
        End: ${endDateTime} <br><br>
        Technical Details: <br>
        Author: ${point.author} <br>
        GUID: ${point.id} <br>
        Link: <a href="${point.link}" target="_blank" rel="noopener noreferrer">${point.link}</a> <br>
        Reference: ${point.reference || point.id}</div>`
        
      );
    }

    return () => map.removeLayer(marker);
  }, [map, point, color]);

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
