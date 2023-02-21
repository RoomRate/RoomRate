import { Icon } from 'leaflet';
import MARKER_ICON from "../../assets/images/marker-icon-red.png";

export const MarkerIcon = new Icon({
  iconAnchor: [ 14, 21 ],
  iconUrl: MARKER_ICON,
  popupAnchor: [ -2, -25 ],
});
