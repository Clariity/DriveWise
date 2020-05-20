// https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/
import React from "react";

const date = new Date();

const ActionType = {
  SET_USER_LOCATION: "SET_USER_LOCATION",
  SET_MAP_MODE: "SET_MAP_MODE",
  SET_MAP_SPINNER: "SET_MAP_SPINNER",
  SET_ROUTE_TO_LOCATION: "SET_ROUTE_TO_LOCATION",
  SET_ROUTE_FROM_LOCATION: "SET_ROUTE_FROM_LOCATION",
  SET_START_DATE: "SET_START_DATE",
  SET_END_DATE: "SET_END_DATE",
  SET_ROUTE: "SET_ROUTE",
  SET_ROADWORKS_DATA: "SET_ROADWORKS_DATA",
  SET_MARKER_INFO: "SET_MARKER_INFO",
  SET_MAP_REFERENCE: "SET_MAP_REFERENCE"
};

const intialState = {
  userLocation: [52.6386, -1.13169],
  mapMode: "normal",
  mapSpinner: false,
  routeToLocation: [],
  routeFromLocation: [],
  startDate: date,
  endDate: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000),
  routeCoordinates: [],
  routeTime: "",
  heIncidents: [],
  heCurrent: [],
  hePlanned: [],
  tflSevere: [],
  tflCurrent: [],
  tflPlanned: [],
  markerInfo: [],
  mapReference: null
};
const StoreContext = React.createContext(intialState);

const StateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case ActionType.SET_USER_LOCATION:
        return { ...state, userLocation: action.payload };
      case ActionType.SET_MAP_MODE:
        return { ...state, mapMode: action.payload };
      case ActionType.SET_MAP_SPINNER:
        console.log("Setting map spinner to:", action.payload)
        return { ...state, mapSpinner: action.payload };
      case ActionType.SET_ROUTE_TO_LOCATION:
        return { ...state, routeToLocation: action.payload };
      case ActionType.SET_ROUTE_FROM_LOCATION:
        return { ...state, routeFromLocation: action.payload };
      case ActionType.SET_START_DATE:
        return { ...state, startDate: action.payload };
      case ActionType.SET_END_DATE:
        return { ...state, endDate: action.payload };
      case ActionType.SET_ROUTE:
        return { ...state, routeCoordinates: action.payload.coordinates, routeTime: action.payload.time };
      case ActionType.SET_ROADWORKS_DATA:
        return {
          ...state,
          heIncidents: action.payload[0],
          heCurrent: action.payload[1],
          hePlanned: action.payload[2],
          tflSevere: action.payload[3],
          tflCurrent: action.payload[4],
          tflPlanned: action.payload[5]
        };
      case ActionType.SET_MARKER_INFO:
        console.log(action.payload)
        return { ...state, markerInfo: action.payload };
      case ActionType.SET_MAP_REFERENCE:
        return { ...state, mapReference: action.payload };
      default:
       throw new Error(`Unhandled ActionType ${action.type}`)
    }
  }, intialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StateProvider, ActionType };
