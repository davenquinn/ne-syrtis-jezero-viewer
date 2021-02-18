import h from "@macrostrat/hyper";
import { Map, Marker, Popup, TileLayer, withLeaflet } from "react-leaflet";
import VectorGrid from "react-leaflet-vectorgrid";
import "leaflet/dist/leaflet.css";

var vectorServer = "http://localhost:7800/";
var vectorLayerId = "public.map_units";
var vectorUrl = vectorServer + vectorLayerId + "/{z}/{x}/{y}.pbf";
console.log("Reading tiles from " + vectorUrl);
var vectorTileStyling = {};
var vectorTileColor = "green";
vectorTileStyling[vectorLayerId] = {
  fill: true,
  fillColor: vectorTileColor,
  fillOpacity: 0.1,
  color: vectorTileColor,
  opacity: 0.7,
  weight: 2,
};
var vectorTileOptions = {
  attribution:
    "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors, made with Natural Earth",
  vectorTileLayerStyles: vectorTileStyling,
};

const Grid = withLeaflet(VectorGrid);

const FlatMap = (props) => {
  const position = [18.5, 77];
  return h(Map, { center: position, zoom: 10, maxZoom: 14 }, [
    h(TileLayer, {
      url: process.env.API_BASE_URL + "/ctx-global/{z}/{x}/{y}.png",
      attribution:
        "&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors",
    }),
    h(Grid, {
      type: "protobuf",
      url: vectorUrl,
      subdomains: "",
      ...vectorTileOptions,
    }),
  ]);
};

export { FlatMap };
