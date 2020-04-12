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

// import { MapLayer } from "react-leaflet";
// import { withLeaflet } from "react-leaflet";
// import { MAPBOX_API_KEY } from "../Keys";
// import L from "leaflet";
// import "leaflet-routing-machine";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// let leafletElement = L.Routing.control({
//   waypoints: [],
//   router: L.Routing.mapbox(MAPBOX_API_KEY),
//   lineOptions: {
//     styles: [
//       {
//         color: "blue",
//         opacity: 1,
//         weight: 5,
//       },
//     ],
//   },
// });
// // console.log(leafletElement) // deal with additional route options at some point, printed out here

// class RoutingMachine extends MapLayer {
//   componentDidMount() {
//     const { setCoordinates } = this.props;
//     leafletElement.on("routeselected", ({ route }) => {
//       console.log("Setting coordinates for route")
//       setCoordinates(route.coordinates)
//     }
//     );
//   }

//   componentWillUnmount() {
//     leafletElement.off("routeselected");
//   }

//   UNSAFE_componentWillReceiveProps(nextProps) {
//     if (nextProps.from !== this.props.from || nextProps.to !== this.props.to)
//       leafletElement.setWaypoints([nextProps.from, nextProps.to]);
//   }

//   createLeafletElement() {
//     const { map } = this.props;
//     leafletElement.addTo(map.leafletElement);
//     leafletElement.hide(); //hide route description
//     return leafletElement.getPlan();
//   }
// }
// export default withLeaflet(RoutingMachine);
