import { MapLayer } from "react-leaflet";
import { withLeaflet } from "react-leaflet";
import { MAPBOX_API_KEY } from '../Keys'
import L from "leaflet";
import "leaflet-routing-machine";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

let leafletElement = L.Routing.control({
  waypoints: [L.latLng(50.94, 0.264822), L.latLng(50.954358, -0.134224)],
  router: L.Routing.mapbox(MAPBOX_API_KEY)
})

class RoutingMachine extends MapLayer {
  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.from !== this.props.from || nextProps.to !== this.props.to)
      leafletElement.setWaypoints([nextProps.from, nextProps.to])
  }

  createLeafletElement() {
    const {map} = this.props;
    leafletElement.addTo(map.leafletElement);
    leafletElement.hide(); //hide route description
    return leafletElement.getPlan();
  }
}
export default withLeaflet(RoutingMachine);