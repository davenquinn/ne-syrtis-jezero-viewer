import { useRef } from "react";
import {
  Credit,
  WebMapTileServiceImageryProvider,
  TileMapServiceImageryProvider,
} from "cesium";
import h from "@macrostrat/hyper";
import { ImageryLayer } from "resium";
import { GeoLayerProps, HillshadeLayer } from "cesium-viewer/layers";
import MapboxTerrainProvider, {
  TileCoordinates,
} from "@macrostrat/cesium-martini";
import SphericalMercator from "@mapbox/sphericalmercator";

const MARS_RADIUS_SCALAR = 3390 / 6371;

const CTXLayer = (props: GeoLayerProps) => {
  let ctx = useRef(
    new WebMapTileServiceImageryProvider({
      url:
        process.env.API_BASE_URL +
        "/ctx-global/{TileMatrix}/{TileCol}/{TileRow}.png",
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

const MOLALayer = (props: GeoLayerProps) => {
  let ctx = useRef(
    new TileMapServiceImageryProvider({
      url:
        "http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/mola-gray",
      fileExtension: "png",
      maximumLevel: 12,
      layer: "",
      tileMatrixSetID: "",
      credit: new Credit("OpenPlanetaryMap/CARTO"),
    })
  );
  return h(ImageryLayer, { imageryProvider: ctx.current, ...props });
};

let merc = new SphericalMercator({ size: 256 });

let bounds = {
  w: 74.4,
  s: 15.8,
  e: 78.7,
  n: 19.5,
};

class SyrtisTerrainProvider extends MapboxTerrainProvider {
  RADIUS_SCALAR = MARS_RADIUS_SCALAR;
  meshErrorScalar = 1;
  fillValue = -4000;
  credit = new Credit(
    "University of Arizona - HiRISE, CTX, PDS Imaging Node, HRSC Mission Team"
  );
  buildTileURL(tileCoords: TileCoordinates) {
    const { z, x, y } = tileCoords;
    const hires = this.highResolution ? "@2x" : "";
    return `${process.env.API_BASE_URL}/terrain/${z}/${x}/${y}${hires}.png`;
  }

  preprocessHeight(x, y, height) {
    return height < 2000 ? height : -2000;
  }

  getTileDataAvailable(x, y, z) {
    const [w, s, e, n] = merc.bbox(x, y, z);
    if (e < bounds.w || w > bounds.e || n < bounds.s || s > bounds.n)
      return false;
    return z <= 13;
  }
}

const CRISMLayer = (props: GeoLayerProps) => {
  let ctx = useRef(
    new WebMapTileServiceImageryProvider({
      url:
        process.env.API_BASE_URL +
        "/crism/{TileMatrix}/{TileCol}/{TileRow}.png",
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

export {
  CRISMLayer,
  CTXLayer,
  MOLALayer,
  HillshadeLayer,
  SyrtisTerrainProvider,
};
