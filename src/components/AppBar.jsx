import React from "react"
import "../styles/AppBar.css"

export default () => {
  return (
    <div className="app-bar">
      <img src="logo.png" alt="Drive Wise logo" height="60px"/>
      <h1 className="title">DriveWise</h1>
      <h2 className="app-bar-button">about</h2>
      <h2 className="app-bar-button">how to use</h2>
    </div>
  )
}