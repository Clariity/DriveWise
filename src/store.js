// https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/
import React from "react";

const ActionType = {
  SET_MAP_CENTER: "SET_MAP_CENTER",
  SET_MAP_ZOOM: "SET_MAP_ZOOM",
  SET_ROUTE_TO_LOCATION: "SET_ROUTE_TO_LOCATION",
  SET_ROUTE_FROM_LOCATION: "SET_ROUTE_FROM_LOCATION",
  SET_ROUTE_COORDINATES: "SET_ROUTE_COORDINATES",
  SET_HE_INCIDENTS: "SET_HE_INCIDENTS",
  SET_HE_CURRENT: "SET_HE_CURRENT",
  SET_HE_PLANNED: "SET_HE_PLANNED",
  SET_TFL_SEVERE: "SET_TFL_SEVERE",
  SET_TFL_CURRENT: "SET_TFL_CURRENT",
  SET_TFL_PLANNED: "SET_TFL_PLANNED",
};

const intialState = {
  mapCenter: [52.6386, -1.13169],
  mapZoom: 8,
  routeToLocation: null,
  routeFromLocation: null,
  routeCoordinates: [],
  heIncidents: [],
  heCurrent: [],
  hePlanned: [],
};
const StoreContext = React.createContext(intialState);

const StateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case ActionType.SET_MAP_CENTER:
        return { ...state, mapCenter: action.payload };
      case ActionType.SET_MAP_ZOOM:
        return { ...state, mapZoom: action.payload };
      case ActionType.SET_ROUTE_TO_LOCATION:
        return { ...state, routeToLocation: action.payload };
      case ActionType.SET_ROUTE_FROM_LOCATION:
        return { ...state, routeFromLocation: action.payload };
      case ActionType.SET_ROUTE_COORDINATES:
        return { ...state, routeCoordinates: action.payload };
      case ActionType.SET_HE_INCIDENTS:
        return { ...state, heIncidents: action.payload };
      case ActionType.SET_HE_CURRENT:
        return { ...state, heCurrent: action.payload };
      case ActionType.SET_HE_PLANNED:
        return { ...state, hePlanned: action.payload };
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
