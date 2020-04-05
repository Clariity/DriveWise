import React from 'react'
import RouteInputRow from './RouteInputRow';

export default ({handleRouteChange, routeMode, setRouteMode, locationPicked, setLocationPicked}) => {
  return (
    <div className='route'>
      <div className='routeInputs'>
        {routeMode !== 'none' && <div className='blur'/>}
        <RouteInputRow 
          direction="from" 
          handleRouteChange={handleRouteChange} 
          routeMode={routeMode} 
          setRouteMode={setRouteMode}
          locationPicked={locationPicked}
          setLocationPicked={setLocationPicked}
        />
        <RouteInputRow 
          direction="to" 
          handleRouteChange={handleRouteChange} 
          routeMode={routeMode} 
          setRouteMode={setRouteMode}
          locationPicked={locationPicked}
          setLocationPicked={setLocationPicked}
        />
      </div>
      { routeMode === "none"
        ? <div className="routeInfo">
            <h1>Journey, Incident and Road Work Information Will Go Here</h1>
          </div>
        : <div onClick={() => setRouteMode("none")} className="routeModeInfo">
            <h1>Route Select Mode: {routeMode === "to" ? " Destination" : " Starting Point"}</h1>
             <p>Click a location on the map to select it as your {routeMode === "to" ? "destination" : "starting point"}.</p>
             <p>Right click on the map to exit Route Select Mode. Alternatively left click within the dotted section here, or left click on the highlighted Route Select Mode toggle button to also exit Route Select Mode.</p> 
          </div>
      }
    </div>
  )
}