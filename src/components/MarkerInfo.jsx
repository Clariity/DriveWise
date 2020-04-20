import React, { useState, useContext } from "react"
import { StoreContext } from "../store";
import "../styles/MarkerInfo.css"

export default ({ info }) => {
  const { state } = useContext(StoreContext);
  const startDateTime = new Date(info.overallStart)
  const endDateTime = new Date(info.overallEnd)
  const [ showMore, setShowMore ] = useState(false)

  return (
    <div className="marker-info">
      <img className="marker-icon-image" src="./media/marker-icon-orange.png" alt="marker colour" onClick={() => state.mapReference.setView([info.latitude, info.longitude], 15)}/>
      <p className="icon-info">Click marker above to show on map</p>
      <div className="marker-info-content">
        <p className="info-title">{info.title}</p>
        <p>
          {info.category1} - {info.category2}
        </p>
        <p>
          <b>Start:</b> {`${startDateTime}`} <br/>
          <b>End:</b> {`${endDateTime}`} <br/>
        </p>
        <p>Technical Details: <i className="show-technical-details" onClick={() => setShowMore(!showMore)}>{!showMore ? "Show more" : "Show less"}</i></p>
        {showMore && <p className="info-technical-details">
          Author: {info.author} <br />
          GUID: {info.guid} <br />
          Link: <a href={info.link} target="_blank" rel="noopener noreferrer">{info.link}</a> <br />
          Reference: {info.reference}
        </p>}
      </div>
    </div>
  )
}