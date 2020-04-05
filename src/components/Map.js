import React, { useEffect, useState } from "react";
import { Map, TileLayer } from "react-leaflet";
import { MAPBOX_API_KEY } from '../Keys'
import Swal from 'sweetalert2'
import Routing from "./RoutingMachine";

export default ({handleRouteChange, routeMode, setRouteMode, currentPosition, from, to}) => {
  const [position, setPosition] = useState(currentPosition || [53.93,-4.21]) //lat, lon
  const [zoom, setZoom] = useState(7)
  const [isMapInit, setIsMapInit] = useState(false)
  const [map, setMap] = useState(null)

  useEffect(() => {
    setPosition(currentPosition)
    setZoom(15)
  },[currentPosition])

  useEffect(() => {
    setZoom(1)
    setPosition([(from.lat + to.lat)/2,(from.lng + to.lng)/2])
  },[from, to])

  const saveMap = map => {
    setMap(map);
    setIsMapInit(true)
  }

  const handleClick = async e => {
    if(routeMode !== "none") {
      const clickedLocation = await fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/" + e.latlng.lng + "," + e.latlng.lat + ".json?country=GB&types=address&access_token=" + MAPBOX_API_KEY)
      const clickedLocationJson = await clickedLocation.json()
      console.log(clickedLocationJson)
      if(clickedLocationJson.features.length >=1)
        handleRouteChange(routeMode, [{text: clickedLocationJson.features[0].place_name, latlng: [e.latlng.lat, e.latlng.lng]}])
      else {
        Swal.fire({
          icon: 'error',
          title: 'No Address Found',
          text: 'No address found in the selected location, please try a new location.'
        })
      }
    } else {
      //drop a pin / change dropped pin location (maybe always just set as to location?)
    }
  } 

  return (
    routeMode === "none"
    ? <Map 
        className={'map map' + routeMode} 
        center={position} 
        zoom={zoom} 
        ref={saveMap}
        onClick={handleClick}
      >
        <TileLayer
          attribution="&amp;copy <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &amp;copy <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>" //need to also attribute MapBox!
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        {isMapInit && <Routing map={map} from={from} to={to}/>}
      </Map>
    : <Map 
        className={'map map' + routeMode} 
        center={position} 
        zoom={zoom} 
        ref={saveMap}
        onClick={handleClick}
        onContextMenu={() => setRouteMode("none")}
      >
        <TileLayer
          attribution="&amp;copy <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &amp;copy <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>" //need to also attribute MapBox!
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        {isMapInit && <Routing map={map} from={from} to={to}/>}
      </Map>
  )
}