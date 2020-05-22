import React, { useState, useEffect } from "react"
import "../styles/AppBar.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import AboutModal from "./AboutModal";
import HowToModal from "./HowToModal";

export default () => {
  const [burgerMenuNeeded, setBurgerMenuNeeded] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showHowToModal, setShowHowToModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function updateDimensions() {
      setBurgerMenuNeeded(window.innerWidth <= 550)
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [setBurgerMenuNeeded])

  return (
    <div className={menuOpen ? "app-bar app-bar-open" : "app-bar"}>
      <div className="title-group">
        <img src="logo.png" alt="Drive Wise logo" height="60px"/>
        <h1 className="title">DriveWise</h1>
      </div>
      { menuOpen
        ? <> 
            <h2 className="app-bar-button" onClick={() => setShowAboutModal(true)}>about</h2>
            <h2 className="app-bar-button" onClick={() => setShowHowToModal(true)}>how to use</h2>
            <i className="material-icons app-bar-button burger-menu-button-close" onClick={() => setMenuOpen(false)}>expand_less</i>
          </>
        : burgerMenuNeeded
          ? <i className="material-icons app-bar-button burger-menu-button-open" onClick={() => setMenuOpen(true)}>menu</i>
          : <> 
              <h2 className="app-bar-button" onClick={() => setShowAboutModal(true)}>about</h2>
              <h2 className="app-bar-button" onClick={() => setShowHowToModal(true)}>how to use</h2>
            </>
      }
      <AboutModal show={showAboutModal} setShowAboutModal={setShowAboutModal} />
      <HowToModal show={showHowToModal} setShowHowToModal={setShowHowToModal} />
    </div>
  )
}