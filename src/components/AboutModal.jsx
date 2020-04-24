import React from "react"
import { Modal } from "react-bootstrap"

export default ({ show, setShowAboutModal }) => {
  return (
    <Modal show={show} onHide={() => setShowAboutModal(false)} style={{opacity:1}} centered>
      <Modal.Header>
        <Modal.Title>
          <h1>
            About <span className="drive-wise-font">DriveWise</span>
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2>What is <span className="drive-wise-font">DriveWise</span>?</h2>
        <ul>
          <li><span className="drive-wise-font">DriveWise</span> is a route planning tool that identifies current and upcoming disruptions to your journey. </li>
          <li>It displays these disruptions in easy to understand colour coded markers and informs you when they will be taking place. </li>
          <li><span className="drive-wise-font">DriveWise</span> helps you to plan any upcoming journeys in advance and know if you will need to prepare to find an alternative route.</li>
          <li>You can see how long your journey may be disrupted and can view any alternative routes provided by the tool.</li>
        </ul>
        <br />
        <h2>What does <span className="drive-wise-font">DriveWise</span> offer that similar routing tools do not?</h2>
        <ul>
          <li>Other tools such as Google Maps offer great driving services and inform you of current traffic conditions. </li>
          <li>However, they do not additionally inform you of upcoming roadworks alongside any current roadworks or traffic incidents.</li>
          <li>Whilst the services we use (Highways England and Transport for London) do offer their own tools that displays this information, <span className="drive-wise-font">DriveWise</span> brings all the information together in one useful tool that is easy to understand and use.</li>
          <li>Additionally, <span className="drive-wise-font">DriveWise</span> provides routing capabilities, date filtering and a user friendly interface to interact with the data.</li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <h2 className="app-bar-button" onClick={() => setShowAboutModal(false)}>Close</h2>
      </Modal.Footer>
    </Modal>
  )
}