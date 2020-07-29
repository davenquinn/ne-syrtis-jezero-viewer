import h from "@macrostrat/hyper";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const FlatMap = (props) => {
  const position = [18.5, 77];
  return h(Map, { center: position, zoom: 10, maxZoom: 14 }, [
    h(TileLayer, {
      url: "http://0.0.0.0:8080/ctx-global/{z}/{x}/{y}.png",
      attribution:
        "&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors",
    }),
  ]);
};

export { FlatMap };
