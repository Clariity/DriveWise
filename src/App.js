import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

export default () => {
  const [heIncidents, setHeIncidents] = useState([]) // Red Pins HE
  const [heRoadworksCurrent, setHeRoadworksCurrent] = useState([]) // Orange Pins HE
  const [heRoadworksPlanned, setHeRoadworksPlanned] = useState([]) // Yellow Pins HE
  const [tflSevere, setTflSevere] = useState([]) // Red Pins TFL
  const [tflCurrent, setTflCurrent] = useState([]) // Orange Pins TFL
  const [tflPlanned, setTflPlanned] = useState([]) // Yellow Pins TFL
  const [loadedData, setLoadedData] = useState(false) // Loading Data Flag to prevent reloads

  const [userLocation, setUserLocation] = useState(null)


  useEffect(() => {
    async function fetchXML() {
      if (!loadedData) { //set to loaded once data is loaded, prevents infinte looping
        const date = new Date()
        const today = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getUTCDate()
        const nextWeekDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000) 
        const nextWeek = nextWeekDate.getFullYear() + '-' + (nextWeekDate.getMonth()+1) + '-' + nextWeekDate.getUTCDate()
        const heIncidentsResponse = await fetch('http://m.highwaysengland.co.uk/feeds/rss/UnplannedEvents.xml') // fetch current HE incidents
        const heRoadworksResponse = await fetch('http://m.highwaysengland.co.uk/feeds/rss/CurrentAndFutureEvents.xml') // fetch current and planned HE roadworks
        const tflResponse = await fetch('https://api.tfl.gov.uk/Road/All/Disruption?startDate='+today+'&endDate='+nextWeek) // fetch current TFL disruptions, and current and planned TFL roadworks (default time frame 1 week)
        const heIncidentsText = await heIncidentsResponse.text()
        const heRoadworksText = await heRoadworksResponse.text()
        const tflJson = await tflResponse.json()

        let parser, heIncidentsXml, heRoadworksXml
        if (window.DOMParser) { // parse XML
          parser = new DOMParser();
          heIncidentsXml = parser.parseFromString(heIncidentsText, "text/xml");
          heRoadworksXml = parser.parseFromString(heRoadworksText, "text/xml");
        } else { // Internet Explorer
          heIncidentsXml = new window.ActiveXObject("Microsoft.XMLDOM");
          heRoadworksXml = new window.ActiveXObject("Microsoft.XMLDOM");
          heIncidentsXml.async = false;
          heRoadworksXml.async = false;
          heIncidentsXml.loadXML(heIncidentsText);
          heRoadworksXml.loadXML(heRoadworksText);
        }
        let newHeIncidents = [], newHeRoadworksCurrent = [], newHeRoadworksPlanned = [], newTflSevere = [], newTflCurrent = [], newTflPlanned = []

        const incidentItems = heIncidentsXml.getElementsByTagName("item")
        for(let i = 0; i < incidentItems.length; i++) { // loop through each incident, create Object for it and add to incident array
          let item = heIncidentsXml.getElementsByTagName("item")[i] // get current item
          newHeIncidents.push({
            author: item.getElementsByTagName("author")[0].innerHTML,
            category1: item.getElementsByTagName("category")[0].innerHTML,
            category2: item.getElementsByTagName("category")[1].innerHTML,
            description: item.getElementsByTagName("description")[0].innerHTML,
            guid: item.getElementsByTagName("guid")[0].innerHTML,
            link: item.getElementsByTagName("link")[0].innerHTML,
            pubDate: item.getElementsByTagName("pubDate")[0].innerHTML,
            title: item.getElementsByTagName("title")[0].innerHTML,
            reference: item.getElementsByTagName("reference")[0].innerHTML,
            road: item.getElementsByTagName("road")[0].innerHTML,
            region: item.getElementsByTagName("region")[0].innerHTML,
            county: item.getElementsByTagName("county")[0].innerHTML,
            latitude: item.getElementsByTagName("latitude")[0].innerHTML,
            longitude: item.getElementsByTagName("longitude")[0].innerHTML,
            overallStart: item.getElementsByTagName("overallStart")[0].innerHTML,
            overallEnd: item.getElementsByTagName("overallEnd")[0].innerHTML,
            eventStart: item.getElementsByTagName("eventStart")[0].innerHTML,
            eventEnd: item.getElementsByTagName("eventEnd")[0].innerHTML
          })
        }

        const roadworksItems = heRoadworksXml.getElementsByTagName("item")
        let pushToArray = null
        for(let i = 0; i < roadworksItems.length; i++) { // loop through each planned work, create Object for it and add to planned work array
          let item = heRoadworksXml.getElementsByTagName("item")[i]// get current item
          pushToArray = ((new Date(item.getElementsByTagName("overallStart")[0].innerHTML) <= date) && (date <= new Date(item.getElementsByTagName("overallEnd")[0].innerHTML))) ? newHeRoadworksCurrent : newHeRoadworksPlanned // if roadwork is currently being carried out
          pushToArray.push({
            author: item.getElementsByTagName("author")[0].innerHTML,
            category1: item.getElementsByTagName("category")[0].innerHTML,
            category2: item.getElementsByTagName("category")[1].innerHTML,
            description: item.getElementsByTagName("description")[0].innerHTML,
            guid: item.getElementsByTagName("guid")[0].innerHTML,
            link: item.getElementsByTagName("link")[0].innerHTML,
            pubDate: item.getElementsByTagName("pubDate")[0].innerHTML,
            title: item.getElementsByTagName("title")[0].innerHTML,
            reference: item.getElementsByTagName("reference")[0].innerHTML,
            road: item.getElementsByTagName("road")[0].innerHTML,
            region: item.getElementsByTagName("region")[0].innerHTML,
            county: item.getElementsByTagName("county")[0].innerHTML,
            latitude: item.getElementsByTagName("latitude")[0].innerHTML,
            longitude: item.getElementsByTagName("longitude")[0].innerHTML,
            overallStart: item.getElementsByTagName("overallStart")[0].innerHTML,
            overallEnd: item.getElementsByTagName("overallEnd")[0].innerHTML,
            eventStart: item.getElementsByTagName("eventStart")[0].innerHTML,
            eventEnd: item.getElementsByTagName("eventEnd")[0].innerHTML
          })
        }

        for(let j = 0; j < tflJson.length; j++) {
          pushToArray = (tflJson[j].severity === "Severe") 
            ? newTflSevere 
            : ((new Date(tflJson[j].startDateTime) <= date) && (date <= new Date (tflJson[j].endDateTime))) ? newTflCurrent : newTflPlanned
            pushToArray.push(tflJson[j])
        }
        setHeIncidents(newHeIncidents)
        setHeRoadworksCurrent(newHeRoadworksCurrent)
        setHeRoadworksPlanned(newHeRoadworksPlanned)
        setTflSevere(newTflSevere)
        setTflCurrent(newTflCurrent)
        setTflPlanned(newTflPlanned)
        setLoadedData(true) //data is now loaded, set to loaded to prevent re-download of data
      }
    }
    fetchXML()
  },[loadedData])

  useEffect(() => {
    if(userLocation === null) {
      const setCurrentPosition = position => setUserLocation([position.coords.latitude, position.coords.longitude]) 
      const positionError = err => {
        console.log(err)
      }

      if (navigator.geolocation) { 
        navigator.geolocation.getCurrentPosition(setCurrentPosition, positionError, { 
          enableHighAccuracy: false, 
          timeout: 15000, 
          maximumAge: 0 
        })
      } 
    }
  })
  
  if(loadedData){ // currently printed twice due to re-render on "DATA LOADED" below, not an issue
    console.log(heIncidents.length, heRoadworksCurrent.length, heRoadworksPlanned.length, tflSevere.length, tflCurrent.length, tflPlanned.length)
    console.log(heIncidents, heRoadworksCurrent, heRoadworksPlanned, tflSevere, tflCurrent, tflPlanned)
  }

  return (
    <div className="App">
      <header className="App-header">
        {!loadedData ? <p>LOADING DATA!!!</p> : <p>DATA LOADED :)</p>}
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}