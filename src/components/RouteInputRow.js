import React, {useState} from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import { MAPBOX_API_KEY } from '../Keys'
// import 'react-bootstrap-typeahead/css/Typeahead.css';
import '../styles/RouteInput.css'

export default ({direction, handleRouteChange}) => {
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([]) //{text: "Greenwood Court, Southampton...", latlon: [52.34, 0.987]}

  const handleChange = (newValue) => {
    setSelected(newValue)
    if(newValue.length === 0)
      setOptions([])
    else 
      handleRouteChange(direction, newValue)
  }

  const handleInputChange = async (newValue) => {
    if(newValue.length >= 4) {
      let optionsArray = []
      const newOptions = await fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(newValue) + ".json?country=GB&access_token=" + MAPBOX_API_KEY)
      const newOptionsJson = await newOptions.json()
      console.log(newOptionsJson.features)
      newOptionsJson.features.map((option) => {
        return optionsArray.push({
          text: option.place_name,
          latlong: [option.center[1], option.center[0]]
        })
      })
      setOptions(optionsArray)
    } else {
      setOptions([])
    }
  }

  return (
    <div className='routeInputRow'>
      <Typeahead
        id="routeFromInput"
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
      <button className='clearSelected' onClick={() => handleChange([])}>
        <i className="material-icons">clear</i>
      </button>
    </div>
  )
}