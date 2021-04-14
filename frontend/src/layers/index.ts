import { useRef } from "react";
import {
  Credit,
  WebMapTileServiceImageryProvider,
  UrlTemplateImageryProvider,
  TileMapServiceImageryProvider,
} from "cesium";
import h from "@macrostrat/hyper";
import { ImageryLayer } from "resium";
import {
  GeoLayerProps,
  MarsHillshadeLayer,
  //MapboxVectorTileImageryProvider,
} from "cesium-viewer/layers";
import MapboxTerrainProvider, {
  TileCoordinates,
} from "@macrostrat/cesium-martini";
import SphericalMercator from "@mapbox/sphericalmercator";
const Cesium: any = require("cesiumSource/Cesium");
import { ImageryLayerCollection } from "resium";
import { OverlayLayer } from "../state";
import { ActiveMapLayer } from "cesium-viewer/actions";
import { RoverPosition } from "../rover-position";
import { useSelector } from "react-redux";
import { GeologyLayer } from "./geology";

const MARS_RADIUS_SCALAR = 3390 / 6371;

const CTXLayer = (props: GeoLayerProps) => {
  let ctx = useRef(
    new WebMapTileServiceImageryProvider({
      url:
        process.env.API_BASE_URL +
        "/tiles/ctx-global/{TileMatrix}/{TileCol}/{TileRow}.png",
      style: "default",
      format: "image/png",
      maximumLevel: 14,
      layer: "",
      tileMatrixSetID: "",
      credit: new Credit("Murray Lab / CTX "),
    })
  );

  return h(ImageryLayer, { imageryProvider: ctx.current, ...props });
};

const HiRISELayer = (props: GeoLayerProps) => {
  let ctx = useRef(
    new WebMapTileServiceImageryProvider({
      url:
        process.env.API_BASE_URL +
        "/tiles/hirise-jezero-trn/{TileMatrix}/{TileCol}/{TileRow}.png",
      style: "default",
      format: "image/png",
      maximumLevel: 18,
      layer: "",
      tileMatrixSetID: "",
      credit: new Credit("USGS"),
    })
  );
  return h(ImageryLayer, {
    imageryProvider: ctx.current,
    colorToAlpha: Cesium.Color.BLACK,
    ...props,
  });
};

const MOLALayer = (props: GeoLayerProps) => {
  let ctx = useRef(
    new TileMapServiceImageryProvider({
      url:
        "https://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/mola-gray",
      fileExtension: "png",
      maximumLevel: 6,
      layer: "",
      tileMatrixSetID: "",
      // Convince the viewer to load a lower level of detail for global tiles
      // to avoid stressing the server
      // tileWidth: 512,
      // tileHeight: 512,
      // Global coverage
      rectangle: new Cesium.Rectangle(
        -Math.PI,
        -Math.PI / 2,
        Math.PI,
        Math.PI / 2
      ),
      credit: new Credit("OpenPlanetaryMap/CARTO"),
      ellipsoid: Cesium.Ellipsoid.MARSIAU2000,
      tilingScheme: new Cesium.WebMercatorTilingScheme({
        ellipsoid: Cesium.Ellipsoid.MARSIAU2000,
      }),
    })
  );
  return h(ImageryLayer, { imageryProvider: ctx.current, ...props });
};

let merc = new SphericalMercator({ size: 256 });

let bounds = {
  w: 72,
  s: 13,
  e: 80,
  n: 23,
};

class SyrtisTerrainProvider extends MapboxTerrainProvider {
  RADIUS_SCALAR = MARS_RADIUS_SCALAR;
  meshErrorScalar = 1;
  levelOfDetailScalar = 8;
  fillValue = -4000;
  credit = new Credit(
    "University of Arizona - HiRISE, CTX, PDS Imaging Node, HRSC Mission Team"
  );

  constructor(opts = {}) {
    super({ ...opts, highResolution: true });
  }

  buildTileURL(tileCoords: TileCoordinates) {
    const { z, x, y } = tileCoords;
    const hires = this.highResolution ? "@2x" : "";
    return `${process.env.API_BASE_URL}/tiles/terrain/${z}/${x}/${y}${hires}.png`;
  }

  preprocessHeight(x, y, height) {
    return height < 4000 ? height : -4000;
  }

  getTileDataAvailable(x, y, z) {
    // const [w, s, e, n] = merc.bbox(x, y, z);
    // if (e < bounds.w || w > bounds.e || n < bounds.s || s > bounds.n)
    //   return false;
    return z <= 13;
  }
}

const CRISMLayer = (props: GeoLayerProps) => {
  let ctx = useRef(
    new WebMapTileServiceImageryProvider({
      url:
        process.env.API_BASE_URL +
        "/tiles/crism/{TileMatrix}/{TileCol}/{TileRow}.png",
      style: "default",
      format: "image/png",
      maximumLevel: 11,
      layer: "",
      tileMatrixSetID: "",
      credit: new Credit("JHU-APL/CRISM"),
    })
  );
  return h(ImageryLayer, { imageryProvider: ctx.current, ...props });
};

const ImageryLayers = () => {
  const mapLayer = useSelector((s) => s.mapLayer);
  const overlays = useSelector((s) => s.overlayLayers);
  const visibleMaps = useSelector((s) => s.visibleMaps);
  return h([
    h(ImageryLayerCollection, null, [
      h(MOLALayer),
      h.if(mapLayer == ActiveMapLayer.CTX)(CTXLayer),
      h.if(mapLayer == ActiveMapLayer.Hillshade)(MarsHillshadeLayer),
    ]),
    h(ImageryLayerCollection, null, [
      h.if(overlays.has(OverlayLayer.HiRISE))(HiRISELayer),
      h.if(overlays.has(OverlayLayer.CRISM))(CRISMLayer),
      h.if(overlays.has(OverlayLayer.Geology))(GeologyLayer, { visibleMaps }),
      h.if(overlays.has(OverlayLayer.Rover))(RoverPosition),
    ]),
  ]);
};

export {
  CRISMLayer,
  CTXLayer,
  MOLALayer,
  HiRISELayer,
  MarsHillshadeLayer,
  SyrtisTerrainProvider,
  ImageryLayers,
};
