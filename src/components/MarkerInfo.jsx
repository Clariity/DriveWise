import React, { useState, useContext } from "react"
import { StoreContext } from "../store";
import "../styles/MarkerInfo.css"

export default ({ info, color }) => {
  const { state } = useContext(StoreContext);
  const startDateTime = new Date(info.overallStart || info.startDateTime).toLocaleString("en")
  const endDateTime = new Date(info.overallEnd || info.endDateTime).toLocaleString("en")
  const [showMore, setShowMore] = useState(false)

  const [x, y] = "$type" in info ? JSON.parse(info.point) : [parseFloat(info.latitude), info.longitude]
  const latLng = "$type" in info ? [y, x] : [x, y];

  return (
    <div className="marker-info">
      <img className="marker-icon-image" src={`./media/marker-icon-${color}.png`} alt="marker colour" onClick={() => state.mapReference.setView(latLng, 15)} />
      <p className="icon-info">Click marker above to show on map</p>
      <div className="marker-info-content">
        <p className="info-title">{info.title || info.location}</p>
        <p>
          {info.category1 || info.category} - {info.category2 || info.subCategory}
        </p>
        <p>
          <b>Start:</b> {`${startDateTime}`} <br />
          <b>End:</b> {`${endDateTime}`} <br />
        </p>
        <p>Technical Details: <i className="show-technical-details" onClick={() => setShowMore(!showMore)}>{!showMore ? "Show more" : "Show less"}</i></p>
        {showMore && <p className="info-technical-details">
          Author: {info.author || "TFL"} <br />
          GUID: {info.guid || info.id} <br />
          Link: <a href={info.link || `https://api.tfl.gov.uk/Road/All/Disruption${info.url}`} target="_blank" rel="noopener noreferrer">{info.link || `https://api.tfl.gov.uk/Road/All/Disruption${info.url}`}</a> <br />
          {info.reference && <>Reference: {info.reference}</>}
        </p>}
      </div>
    </div>
  )
}