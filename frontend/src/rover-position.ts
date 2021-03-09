const Cesium: any = require("cesiumSource/Cesium");
import h from "@macrostrat/hyper";
import { LabelCollection, Label } from "resium";
import { useAPIResult } from "@macrostrat/ui-components";

function RoverPosition() {
  const res = useAPIResult(
    "https://mars.nasa.gov/mmgis-maps/M20/Layers/json/M20_waypoints_current.json"
  );

  if (res == null) return null;

  const [x, y] = res.features[res.features.length - 1].geometry.coordinates;

  console.log(x, y);

  return h(
    LabelCollection,
    null,
    h(Label, {
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      position: Cesium.Cartesian3.fromDegrees(x, y),
      text: "❖ Perseverance rover",
      font: "20px Source Serif Pro",
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      //nearFarScalar: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0),
    })
  );
}

export { RoverPosition };
