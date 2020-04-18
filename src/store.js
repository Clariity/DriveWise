// https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/
import React from "react";

const date = new Date();

const ActionType = {
  SET_USER_LOCATION: "SET_USER_LOCATION",
  SET_MAP_MODE: "SET_MAP_MODE",
  SET_ROUTE_TO_LOCATION: "SET_ROUTE_TO_LOCATION",
  SET_ROUTE_FROM_LOCATION: "SET_ROUTE_FROM_LOCATION",
  SET_START_DATE: "SET_START_DATE",
  SET_END_DATE: "SET_END_DATE",
  SET_ROUTE_COORDINATES: "SET_ROUTE_COORDINATES",
  SET_HE_INCIDENTS: "SET_HE_INCIDENTS",
  SET_HE_CURRENT: "SET_HE_CURRENT",
  SET_HE_PLANNED: "SET_HE_PLANNED",
  SET_TFL_SEVERE: "SET_TFL_SEVERE",
  SET_TFL_CURRENT: "SET_TFL_CURRENT",
  SET_TFL_PLANNED: "SET_TFL_PLANNED",
};

const intialState = {
  userLocation: [52.6386, -1.13169],
  mapMode: "normal",
  routeToLocation: [],
  routeFromLocation: [],
  startDate: date,
  endDate: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000),
  routeCoordinates: [],
  heIncidents: [],
  heCurrent: [],
  hePlanned: [],
  tflSevere: [],
  tflCurrent: [],
  tflPlanned: [],
};
const StoreContext = React.createContext(intialState);

const StateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case ActionType.SET_USER_LOCATION:
        return { ...state, userLocation: action.payload };
      case ActionType.SET_MAP_MODE:
        return { ...state, mapMode: action.payload };
      case ActionType.SET_ROUTE_TO_LOCATION:
        return { ...state, routeToLocation: action.payload };
      case ActionType.SET_ROUTE_FROM_LOCATION:
        return { ...state, routeFromLocation: action.payload };
      case ActionType.SET_START_DATE:
        return { ...state, startDate: action.payload };
      case ActionType.SET_END_DATE:
        return { ...state, endDate: action.payload };
      case ActionType.SET_ROUTE_COORDINATES:
        return { ...state, routeCoordinates: action.payload };
      case ActionType.SET_HE_INCIDENTS:
        return { ...state, heIncidents: action.payload };
      case ActionType.SET_HE_CURRENT:
        return { ...state, heCurrent: action.payload };
      case ActionType.SET_HE_PLANNED:
        return { ...state, hePlanned: action.payload };
      case ActionType.SET_TFL_SEVERE:
        return { ...state, tflSevere: action.payload };
      case ActionType.SET_TFL_CURRENT:
        return { ...state, tflCurrent: action.payload };
      case ActionType.SET_TFL_PLANNED:
        return { ...state, tflPlanned: action.payload };
      default:
        break;
    }
  }, intialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StateProvider, ActionType };
