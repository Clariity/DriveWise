import React, { useEffect, useContext, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { StoreContext, ActionType } from "../store";
import { MAPBOX_API_KEY } from "../Keys";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

export default function RoutingMachine({ map }) {
  const { state, dispatch } = useContext(StoreContext);
  const [routingControl, setRoutingControl] = useState(null);

  // We use this effect to set up the routing control object and the route selected handler
  useEffect(() => {
    if (map) {
      const control = L.Routing.control({
        waypoints: [],
        router: L.Routing.mapbox(MAPBOX_API_KEY),
        show: false,
        showAlternatives: true,
        lineOptions: {
          styles: [
            { color: "#2d89ef", opacity: 1, weight: 5 }
          ],
        },
        altLineOptions: {
          styles: [
            { color: 'grey', opacity: 1, weight: 5 }
          ]
        }
      });

      control.on("routeselected", ({ route }) => {
        //console.log(route.instructions) Could potentially do something with the instructions
        dispatch({
          type: ActionType.SET_ROUTE_COORDINATES,
          payload: route.coordinates,
        });

        map.fitBounds([route.waypoints[0].latLng, route.waypoints[1].latLng]);
        dispatch({ type: ActionType.SET_MAP_SPINNER, payload: false })
      });

      control.addTo(map);

      setRoutingControl(control);
    }
  }, [map, dispatch]);

  // We use this effect to watch for state changes that affect the router
  useEffect(() => {
    // If we have a from and a to location, we set the waypoints in the router
    if (
      routingControl &&
      state.routeFromLocation.length > 0 &&
      state.routeToLocation.length > 0
    ) {
      dispatch({ type: ActionType.SET_MAP_SPINNER, payload: true })
      routingControl.setWaypoints([
        state.routeFromLocation[0].center,
        state.routeToLocation[0].center,
      ]);
      routingControl.route();
      // Otherwise if either of the locations are missing we clear the router
    } else if (
      routingControl &&
      (state.routeFromLocation.length === 0 ||
        state.routeToLocation.length === 0)
    ) {
      routingControl.setWaypoints([]);
      routingControl.route();
    }
    
  }, [routingControl, map, state.routeFromLocation, state.routeToLocation]);

  return <></>;
}
