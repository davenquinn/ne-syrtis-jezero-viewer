import h from "@macrostrat/hyper";
import { FlatMap } from "./map";
import { Provider, useSelector, useDispatch } from 'react-redux'
import {createStore} from 'redux'
import {CTXLayer, HillshadeLayer, SyrtisTerrainProvider} from './layers'

import {CopyToClipboard} from 'react-copy-to-clipboard';
import CesiumViewer, {DisplayQuality} from "cesium-viewer";
import "./main.styl";

import {reducer, ActiveMapLayer} from 'cesium-viewer/actions'


let store = createStore(reducer)

const ImageryLayers = ()=>{
  const mapLayer = useSelector(s => s.activeMapLayer)
  return h([
    h.if(mapLayer != ActiveMapLayer.Hillshade)(CTXLayer),
    h.if(mapLayer == ActiveMapLayer.Hillshade)(HillshadeLayer)
  ])
}

const terrainProvider = new SyrtisTerrainProvider()

const Viewer = ()=>{
  return h(CesiumViewer, {
    terrainProvider,
    terrainExaggeration: 1.5/terrainProvider.RADIUS_SCALAR,
    displayQuality: DisplayQuality.Low
  }, h(ImageryLayers))
}

const FlyToButton = ({camera, children})=>{
  const dispatch = useDispatch()
  return h("a.fly-to", {onClick() {
    dispatch({type: "fly-to-position", value: camera})
  }}, children)
}

const CopyPositionButton = ()=>{
  const pos = useSelector(s => s.position?.camera)
  let text = ""
  if (pos != null) {
    text = JSON.stringify(pos, (key, val)=>{
      return val.toFixed ? Number(val.toFixed(3)) : val;
    })
  }
  return h(CopyToClipboard, {text, onCopy(){
    console.log(text)
  }}, h("button", "Copy current position"))
}

const positions = {
  "jezero_w": {"longitude":78.285,"latitude":18.388,"height":19088.427,"heading":277.832,"pitch":-32.638,"roll": 0},
  "jezero_delta": {"longitude":77.679,"latitude":18.444,"height":4617.206,"heading":277.832,"pitch":-32.638,"roll": 0},
  "full_of_sediment": {"longitude":77.704,"latitude":17.743,"height":18496.042,"heading":0.124,"pitch":-35.861,"roll":0},
  "outlet_channel": {"longitude":78.135,"latitude":18.376,"height":8164.792,"heading":0.124,"pitch":-35.859,"roll":0},
  // Draining the highlands
  "jezero_upriver": {"longitude":77.342,"latitude":18.56,"height":1061.782,"heading":276.473,"pitch":-16.081,"roll": 0},
  // River towards Arabia Terra
  "river_nili_fossae": {"longitude":77.131,"latitude":18.636,"height":8129.235,"heading":272.243,"pitch":-22.808,"roll":359.874},
  "river_arabia_terra": {"longitude":76.548,"latitude":18.691,"height":10274.631,"heading":276.473,"pitch":-16.081,"roll":360},

}

const PositionListEditor = ({positions})=>{
  return h("div.positions-panel", [
    h("h1", "Positions"),
    h("div.position-list", Object.entries(positions).map(entry => {
      const [k,v] = entry
      return h("p", null, h(FlyToButton, {camera: v}, k))
    })),
    h(CopyPositionButton)
  ])
}

const UI = ()=> {
  return h("div.app-ui", [
    h("div.lower-right", [
      h(PositionListEditor, {positions})
    ]),
    h(Viewer)
  ])
}

const App = () => {
  return h("div.app-container", [
    h(Provider, {store}, h(UI)) // h(FlatMap)
  ]);
};

export default App;
