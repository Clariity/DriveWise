import React, { useEffect, useContext, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { StoreContext, ActionType } from "../store";
import { MAPBOX_API_KEY } from "../Keys";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

export default function RoutingMachine({ map }) {
  const { state, dispatch } = useContext(StoreContext);
  const [routingControl, setRoutingControl] = useState(null);

  useEffect(() => {
    if (map) {
      console.log("making routing control");
      const control = L.Routing.control({
        waypoints: [],
        router: L.Routing.mapbox(MAPBOX_API_KEY),
        show: false,
        lineOptions: {
          styles: [
            {
              color: "blue",
              opacity: 1,
              weight: 5,
            },
          ],
        },
      });

      control.on("routeselected", ({ route }) => {
        console.log("Handling route selected");
        dispatch({
          type: ActionType.SET_ROUTE_COORDINATES,
          payload: route.coordinates,
        });
      });

      control.addTo(map);

      setRoutingControl(control);
    }
  }, [map, dispatch]);

  useEffect(() => {
    if (routingControl && state.routeFromLocation && state.routeToLocation) {
      console.log(state.routeFromLocation);

      routingControl.setWaypoints([
        state.routeFromLocation[0].center,
        state.routeToLocation[0].center,
      ]);
      routingControl.route();
    }
  }, [routingControl, map, state.routeFromLocation, state.routeToLocation]);

  return <></>;
}
