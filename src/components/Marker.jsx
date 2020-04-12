import React, { useEffect } from "react";
import L from "leaflet";

export default function Marker({ map, point }) {
  useEffect(() => {
    const marker = L.marker([point.latitude, point.longitude]);
    if (map) {
      marker.addTo(map);
      marker.bindPopup(point.title);
    }

    return () => map.removeLayer(marker);
  }, [map, point]);

  return <></>;
}

// import React from "react";
// import { Marker, Popup } from "react-leaflet";
// import L from "leaflet";

// export default ({position, colour, point}) => {
//   const icon = new L.Icon({
//     iconUrl: require(`../media/marker-icon-${colour}.png`),
//     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//     iconSize: [25, 41], // size of the icon
//     iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
//     popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
//     shadowSize: [41, 41], // size of the shadow
//   })

//   return (
//     <Marker position={position} icon={icon}>
//       <Popup>
//         <b>{point.title}</b> <br />
//         {point.category1} - {point.category2} <br />
//         Description: {point.description} <br />
//         Start: {point.overallStart} <br />
//         End: {point.overallEnd} <br />
//         Technical Details: <br />
//         Author: {point.author} <br />
//         GUID: {point.guid} <br />
//         link: {point.link} <br />
//         reference {point.reference}
//       </Popup>
//     </Marker>
//   )
// }
