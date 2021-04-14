import MVTImageryProvider from "mvt-imagery-provider";
import { useEffect, useRef } from "react";
import h from "@macrostrat/hyper";
import { ImageryLayer } from "resium";
import { ImageryLayer as CesiumImageryLayer } from "cesium";

function createStyle(visibleMaps = null) {
  let filter = ["boolean", true];
  if (visibleMaps != null) {
    filter = ["match", ["get", "map_id"], visibleMaps, true, false];
  }

  return {
    version: 8,
    sources: {
      geology: {
        type: "vector",
        tiles: [
          process.env.API_BASE_URL +
            "/vector-tiles/public.map_units/{z}/{x}/{y}.pbf",
        ],
        maxzoom: 15,
        minzoom: 5,
      },
    },
    layers: [
      {
        id: "map-units",
        source: "geology",
        "source-layer": "public.map_units",
        type: "fill",
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": 0.3,
        },
        filter,
      },
      {
        id: "unit-edge",
        source: "geology",
        "source-layer": "public.map_units",
        type: "line",
        layout: {
          "line-cap": "round",
        },
        paint: {
          "line-color": ["get", "color"],
          "line-width": 1,
        },
        filter,
      },
    ],
  };
}

const GeologyLayer = ({ visibleMaps = null, ...rest }) => {
  const style = createStyle(null);
  let ctx = useRef(new MVTImageryProvider({ style, maximumZoom: 13 }));
  let lyr = useRef<CesiumImageryLayer | null>(null);
  useEffect(() => {
    let filter = ["boolean", true];
    if (visibleMaps != null) {
      filter = [
        "match",
        ["get", "map_id"],
        Array.from(visibleMaps),
        true,
        false,
      ];
    }
    console.log(filter);
    ctx.current?.mapboxRenderer.setFilter("map-units", filter, false);
    const res = ctx.current?.mapboxRenderer.setFilter(
      "unit-edge",
      filter,
      false
    );
    res();
  }, [visibleMaps]);

  return h(ImageryLayer, { ref: lyr, imageryProvider: ctx.current, ...rest });
};

export { GeologyLayer };
