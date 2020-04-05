import React, { useEffect, useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import { MAPBOX_API_KEY } from '../Keys'
import '../styles/RouteInput.css'

export default ({direction, handleRouteChange, routeMode, setRouteMode, locationPicked, setLocationPicked}) => {
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([]) //{text: "Green Wood Court, Southampton...", latlon: [52.34, 0.987]}

  useEffect(() => { // new location picked, set the typeahead value to new location
    if(routeMode === direction && locationPicked !== null) { //ensure location has been picked in order to activate effect
      console.log(locationPicked, routeMode, direction)
      setSelected(locationPicked)
      document.activeElement.blur() // removes focus (I think)
      setRouteMode("none") // clear route mode
      setLocationPicked(null)
    }
  }, [locationPicked, direction, routeMode, setRouteMode, setLocationPicked])

  const handleChange = (newValue) => {
    setSelected(newValue)
    if(newValue.length === 0) // has been cleared
      setOptions([]) // autofill remove options
    else 
      handleRouteChange(direction, newValue) // option selected. change the route
  }

  const handleInputChange = async (newValue) => { // individual letter changes in typeahead
    if(newValue.length >= 4) { // more than 4 character limit to initiate autofill
      let optionsArray = []
      const newOptions = await fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(newValue) + ".json?country=GB&access_token=" + MAPBOX_API_KEY)
      const newOptionsJson = await newOptions.json() // autofill options
      newOptionsJson.features.map((option) => {
        return optionsArray.push({
          text: option.place_name,
          latlng: [option.center[1], option.center[0]]
        })
      })
      setOptions(optionsArray)
    } else { // autofill remove options
      setOptions([])
    }
  }

  //ADD TOOLTIPS TO BUTTONS
  return (
    <div className='routeInputRow'>
      <Typeahead
        id={"routeInput" + direction}
        labelKey="text"
        onChange={newValue => handleChange(newValue)}
        onInputChange={(newValue, event) => handleInputChange(newValue)}
        options={options}
        placeholder={direction === "to" ? "Where to?" : "Where from?"}
        selected={selected}
        maxResults={5}
        autoFocus={true}
        selectHintOnEnter={true}
        minLength={4}
      />
      <div className='button-row'>
        <button className={routeMode === direction ? 'selectLocation selectLocation' + routeMode : 'selectLocation'} onClick={() => routeMode === "none" ? setRouteMode(direction) : setRouteMode("none")}>
          <i className="material-icons">add_location</i>
        </button>
        <button className='clearSelected' onClick={() => handleChange([])}> 
          <i className="material-icons">clear</i>
        </button>
      </div>
    </div>
  )
}