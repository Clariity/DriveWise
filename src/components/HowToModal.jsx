import React from "react"
import { Modal } from "react-bootstrap"

export default ({ show, setShowHowToModal }) => {
  return (
    <Modal show={show} onHide={() => setShowHowToModal(false)} style={{opacity:1}} centered>
      <Modal.Header>
        <Modal.Title>
          <h1>
            How to use <span className="drive-wise-font">DriveWise</span>
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2>Your Location</h2>
        <p>When the site first loads, it will ask your permission to use your location. Please click "Allow" to use the full functionality of <span className="drive-wise-font">DriveWise</span>.</p>
        <img className="how-to-image orange-border image-margin" src="./media/howToKnowLocation.png" alt=""/>
        <p>If you clicked "Block" and wish to change it, please do so in your browser settings. (In Chrome this can be found in Settings > Privacy and security > Site settings > Location).</p>
        <p>If you have given the site permission to use your location, a marker will appear on the map to show your location.</p>
        <img className="how-to-image" src="./media/howToLocation.png" alt=""/>
        <p>If you have not given the site permission, it will default to a central city in England.</p>
        <br/>
        <h2>Creating a Route</h2>
        <p>There are 3 ways to create a route with <span className="drive-wise-font">DriveWise</span></p>
        <ol>
          <li>
            In the input boxes labelled "Where from?" and "Where to?", type in the places or addresses that you wish to be your starting point and destination. <br/>
            <img className="how-to-image no-indent" src="./media/howToRouteInput.png" alt="How to route input"/>
          </li>
          <li>Use the current location button <img className="how-to-image no-border" src="./media/howToCurrentLocation.png" alt=""/> to set your starting point or destination as your current location.</li>
          <li>
            Use the route mode button <img className="how-to-image no-border" src="./media/howToRouteMode.png" alt=""/> to select a point on the map to be your starting point or destination. 
          </li>
        </ol>
        <p>The data shown on the routes is automatically filtered to be for the next 7 days. This can be edited using the Start and End Date inputs to look for any disruptions in any time frame up to 1 year in the future.</p>
        <img className="how-to-image" src="./media/howToDate.png" alt=""/>
        <p>PLEASE NOTE: The data is provided to us from a separate source which we have no control over and may be updated at any time. If checking for planned roadworks in the future, we recommend checking again closer to the time of your planned travel to see if anything has changed.</p>
        <br/>
        <h2>Route Mode</h2>
        <p>You will know you are in Route Mode as your cursor will be a crosshair when hovering over the map.</p>
        <img className="how-to-image" src="./media/howToCrosshair.png" alt=""/>
        <p>To exit route mode, click on the route mode button <img className="how-to-image no-border" src="./media/howToRouteMode.png" alt=""/> again (or click within the section that has a dashed border).</p>
        <br/>
        <h2>The Route Display</h2>
        <p>When a starting point and destination have been selected, a route will be loaded and displayed on the map, with the start and end points indicated with blue markers.</p>
        <img className="how-to-image" src="./media/howToSampleRoute.png" alt=""/>
        <p>If any current incidents or roadworks, or any planned future roadworks are known to be on the selected route, then colour coded markers will be dropped on the route where they are known to take place. You will also be shown any alternative routes which can be switched to by clicking on them.</p>
        <img className="how-to-image" src="./media/howToAlternative.png" alt=""/>
        <img className="how-to-image no-border" src="./media/marker-icon-gold.png" alt=""/>
        <p>A yellow marker indicates future planned roadworks by Highways England or Transport for London.</p>
        <img className="how-to-image no-border" src="./media/marker-icon-orange.png" alt=""/>
        <p>An orange marker indicates current ongoing roadworks.</p>
        <img className="how-to-image no-border" src="./media/marker-icon-red.png" alt=""/>
        <p>A red marker indicates current road incidents or severe traffic delays caused by roadworks.</p>
        <br/>
        <h2>Incident Information</h2>
        <p>Click on a dropped marker to view information about the incident/roadwork.</p>
        <img className="how-to-image" src="./media/howToMarker.png" alt=""/>
        <p>All incidents and roadworks found on a route will be listed for you to see the information about each one. Click on the marker for the incident for it to be displayed on the map.</p>
        <img className="how-to-image" src="./media/howToRouteInfo.png" alt=""/>
      </Modal.Body>
      <Modal.Footer>
        <h2 className="app-bar-button" onClick={() => setShowHowToModal(false)}>Close</h2>
      </Modal.Footer>
    </Modal>
  )
}