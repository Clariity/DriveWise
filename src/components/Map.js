import React, { useEffect, useState } from "react";
import { Map, TileLayer } from "react-leaflet";
import Routing from "./RoutingMachine";

export default ({currentPosition, from, to}) => {
  const [position, setPosition] = useState(currentPosition || [53.93,-4.21]) //lat, lon
  const [zoom, setZoom] = useState(7)
  const [isMapInit, setIsMapInit] = useState(false)
  const [map, setMap] = useState(null)

  useEffect(() => {
    setPosition(currentPosition)
    setZoom(15)
  },[currentPosition])

  useEffect(() => {
    setPosition([(from.lat + to.lat)/2,(from.lng + to.lng)/2])
    setZoom(12)
  },[from, to])

  const saveMap = map => {
    setMap(map);
    setIsMapInit(true)
  }

  return (
    <Map className='map' center={position} zoom={zoom} ref={saveMap}>
      <TileLayer
        attribution="&amp;copy <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &amp;copy <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>" //need to also attribute MapBox!
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      {isMapInit && <Routing map={map} from={from} to={to}/>}
    </Map>
  )
}