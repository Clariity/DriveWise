import React, { useState, useEffect, useContext } from 'react';
import DatePicker from "react-datepicker";
import { StoreContext, ActionType } from "../store";
import Swal from 'sweetalert2'
import "react-datepicker/dist/react-datepicker.css";
import "../styles/DatePicker.css"

export default ({dateType}) => {
  const [wide, setWide] = useState(true);
  const { state, dispatch } = useContext(StoreContext);
  const date = new Date()

  const selected =
  dateType === "End" ? state.endDate: state.startDate;
  const type =
    dateType === "End"
      ? ActionType.SET_END_DATE
      : ActionType.SET_START_DATE;

  useEffect(() => {
    function updateDimensions() {
      setWide(window.innerWidth >= 1280)
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [setWide])

  function handleSelectedChange(value) {
    //check for endDate being before startDate && if startDate is set beyond endDate, then set endDate to startDate
    if (dateType === "End" && value < state.startDate) {
      Swal.fire({
        icon: "error",
        title: "Date Error",
        text:
          "Cannot set end date to be before start date.",
      });
      return
    } 
    dispatch({ type, payload: value });
    if (dateType === "Start" && value > state.endDate)
      dispatch({ type: ActionType.SET_END_DATE, payload: value });
  }
  
  return (
    <div style={{width: "100%"}}>
      <p className="date-title">{dateType +  " Date"}</p>
      <DatePicker 
        selected={selected} 
        onChange={handleSelectedChange}
        minDate={new Date()} 
        maxDate={new Date(date.setFullYear(date.getFullYear() + 1))}
        todayButton="Go to Today"
        // highlightDates={!multi && !extend && parentProps.state.highlightDates}
        shouldCloseOnSelect={true}
        popperPlacement={wide ? "right" : "top"}
        dateFormat={"dd/MM/yyyy"}
        keyboardType="none"
        disabledKeyboardNavigation
      />
    </div>
  )
}