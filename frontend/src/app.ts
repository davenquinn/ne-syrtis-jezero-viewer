import {hyperStyled} from "@macrostrat/hyper";
import {useRef} from 'react'
import { Provider, useSelector } from 'react-redux'
import {createStore} from 'redux'
import {CTXLayer, HillshadeLayer, SyrtisTerrainProvider} from './layers'

import CesiumViewer, {DisplayQuality} from "cesium-viewer";
import styles from "./main.styl";

import {TextPanel} from './text-panel'
import {reducer, ActiveMapLayer} from 'cesium-viewer/actions'
import {PositionListEditor, CopyPositionButton} from './editor'
import positions from './positions.js'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

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
    displayQuality: DisplayQuality.High
  }, h(ImageryLayers))
}

const Link = ({to, children, ...rest})=>{
  return h("li", null, h(NavLink, {to, activeClassName: styles['is-active'], ...rest}, children))
}

const TitleBlock = ()=>{
  return h("div.title-block", [
    h("h1.title", [
      "Jezero Crater's context within northeast Syrtis Major",
      h("span.subtitle", " — a multiscale interactive exploration")
    ]),
    h("div.auth-affil", [
      h("h3.author", null, h("a", {href: "https://davenquinn.com"}, "Daven Quinn")),
      h("h4.affiliation", [
        "University of Wisconsin – Madison, ",
        h("a", {href: "https://macrostrat.org"}, "Macrostrat")
      ])
    ]),
    h("p.version", "v0.1 – July 2020"),
    h("nav", null, h("ul", [
      h(Link, {to: "/", exact: true}, "Story"),
      h(Link, {to: "/about"}, "The viewer"),
      h(Link, {to: "/list", className: styles["positions"]}, "#"),
    ]))
  ])
}

const About = ()=>{
  return h("div.about", {}, [
  ])
}

const UI = ()=> {
  const ref = useRef()

  return h("div.app-ui", [
    h(Router, [
      h("div.left", [
        h("div.content", {ref}, [
          h(TitleBlock),
          h(Switch, [
            h(Route, {path: "/about"}, [
              h(About)
            ]),
            h(Route, {path: "/list"}, [
              h(PositionListEditor, {positions})
            ]),
            h(Route, {path: "/"}, [
              h(TextPanel, {positions, scrollParentRef: ref })
            ])
          ])
        ])
      ]),
    ]),
    h("div.right", null, [
      h(Viewer),
      h(CopyPositionButton)
    ])
  ])
}

const App = () => {
  return h("div.app-container", [
    h(Provider, {store}, h(UI)) // h(FlatMap)
  ]);
};

export default App;
