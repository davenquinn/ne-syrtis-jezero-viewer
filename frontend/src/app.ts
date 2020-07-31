import {hyperStyled} from "@macrostrat/hyper";
import {useRef} from 'react'
import { Provider, useSelector } from 'react-redux'
import {createStore} from 'redux'
import {CTXLayer, HillshadeLayer, SyrtisTerrainProvider} from './layers'

import CesiumViewer, {DisplayQuality} from "cesium-viewer";
import styles from "./main.styl";

import {TextPanel} from './text-panel'
import {reducer, ActiveMapLayer} from 'cesium-viewer/actions'
import {PositionListEditor} from './editor'
import positions from './positions.js'

const h = hyperStyled(styles)
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

const UI = ()=> {
  const ref = useRef()

  return h("div.app-ui", [
    h("div.left", [
      h("div.content", {ref}, [
        h(TextPanel, {positions, scrollParentRef: ref }),
        h(PositionListEditor, {positions})
      ])
    ]),
    h("div.right", null, h(Viewer))
  ])
}

const App = () => {
  return h("div.app-container", [
    h(Provider, {store}, h(UI)) // h(FlatMap)
  ]);
};

export default App;
