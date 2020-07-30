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

const Viewer = ()=>{
  return h(CesiumViewer, {
    terrainProvider: new SyrtisTerrainProvider(),
    terrainExaggeration: 1.5*6371/3390,
    displayQuality: DisplayQuality.High
  }, h(ImageryLayers))
}

const FlyToButton = ({camera})=>{
  const dispatch = useDispatch()
  return h("button", {onClick() {
    dispatch({type: "fly-to-position", value: camera})
  }}, "Fly to position")
}

const CopyPositionButton = ()=>{
  const pos = useSelector(s => s.cameraPosition)
  let text = ""
  if (pos != null) {
    const {position, orientation} = pos
    text = JSON.stringify({position, orientation})
  }
  return h(CopyToClipboard, {text, onCopy(){
    console.log(text)
  }}, h("button", "Copy"))
}

const UI = ()=> {
  return h("div.app-ui", [
    h("div.lower-right", [
      h(CopyPositionButton),
      h(FlyToButton, {camera: {"position": {"x":1225418.7488849903,"y":5944308.47404358,"z":1993660.2917541615},"orientation":{"x":0.859592562774336,"y":-0.492166838136322,"z":0.13737696117597314}}})
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
