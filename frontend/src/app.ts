import h from "@macrostrat/hyper";
import { FlatMap } from "./map";
import { Provider } from 'react-redux'
import {createStore} from 'redux'
import SphericalMercator from '@mapbox/sphericalmercator'

import MapboxTerrainProvider, {TileCoordinates} from "@macrostrat/cesium-martini"
import CesiumViewer, {DisplayQuality} from "cesium-viewer";
import "./main.styl";

import {reducer} from 'cesium-viewer/actions'


let merc = new SphericalMercator({size: 256})
let bounds = {
  w: 74.4,
  s: 15.8,
  e: 78.7,
  n: 19.5
}

let store = createStore(reducer)

class SyrtisTerrainProvider extends MapboxTerrainProvider {
  buildTileURL(tileCoords: TileCoordinates) {
    const {z,x,y} = tileCoords
    const hires = this.highResolution ? '@2x' : ''
    return `http://localhost:8080/terrain/${z}/${x}/${y}${hires}.png`
  }

  getTileDataAvailable(x, y, z) {
    const [w,s,e,n] = merc.bbox(x,y,z)
    if (e < bounds.w || w > bounds.e || n < bounds.s || s > bounds.n) return false
    return z <= 13
  }

  fillValue: -4000
}

const Viewer = ()=>{
  return h(CesiumViewer, {
    terrainProvider: new SyrtisTerrainProvider(),
    terrainExaggeration: 1.5*6371/3390,
    displayQuality: DisplayQuality.High
  })
}


const App = () => {
  return h("div.app-container", [
    h(Provider, {store}, h(Viewer)) // h(FlatMap)
  ]);
};

export default App;
