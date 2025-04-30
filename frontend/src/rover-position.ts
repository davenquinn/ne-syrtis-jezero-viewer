const Cesium: any = require("cesiumSource/Cesium");
import h from "@macrostrat/hyper";
import {LabelCollection, Label, Entity, PolylineGraphics} from "resium";
import { useState, useEffect } from "react";

function RoverPosition() {

  const [ res, setRes ] = useState(null);
  useEffect(() => {
    fetch("https://mars.nasa.gov/mmgis-maps/M20/Layers/json/M20_waypoints_current.json")
      .then((res=> res.json()))
      .then((data) => { setRes(data); })
      .catch((err) => { console.log(err); });
  }, [])


  if (res == null) return null;



  const [x, y] = res.features[res.features.length - 1].geometry.coordinates;

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

export function RoverTrack() {

  const [ res, setRes ] = useState(null);
  useEffect(() => {
    fetch("https://mars.nasa.gov/mmgis-maps/M20/Layers/json/M20_waypoints.json")
      .then((res=> res.json()))
      .then((data) => { setRes(data); })
      .catch((err) => { console.log(err); });
  }, [])


  if (res == null) return null;



  return h(Entity, [
    h(PolylineGraphics, {
      positions: res.features.map((d) => {
        return Cesium.Cartesian3.fromDegrees(
          d.geometry.coordinates[0],
          d.geometry.coordinates[1],
        );
      }),
      width: 2,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      perPositionHeight: true,
    })
  ])
}



export { RoverPosition };
