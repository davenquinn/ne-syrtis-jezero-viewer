import { hyperStyled } from "@macrostrat/hyper";
import { useRef } from "react";
import { Provider, useSelector } from "react-redux";
import { createStore } from "redux";
import { CTXLayer, HillshadeLayer, SyrtisTerrainProvider } from "./layers";

import CesiumViewer, { DisplayQuality } from "cesium-viewer";
import styles from "./main.styl";

import { TitleBlock } from "./title-block";
import { TextPanel } from "./text-panel";
import {
  reducer,
  ActiveMapLayer,
  createInitialState,
} from "cesium-viewer/actions";
import { PositionListEditor, CopyPositionButton } from "./editor";
import positions from "./positions.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { flyToParams } from "cesium-viewer/position";

const h = hyperStyled(styles);

const flyToProps = flyToParams(positions["initial"], {
  duration: 0,
  once: true,
});

const initialState = createInitialState({
  positions,
  flyToProps,
  namedLocation: "initial",
});
let store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const ImageryLayers = () => {
  const mapLayer = useSelector((s) => s.activeMapLayer);
  return h([
    h.if(mapLayer != ActiveMapLayer.Hillshade)(CTXLayer),
    h.if(mapLayer == ActiveMapLayer.Hillshade)(HillshadeLayer),
  ]);
};

const terrainProvider = new SyrtisTerrainProvider();

const Viewer = () => {
  return h(
    CesiumViewer,
    {
      terrainProvider,
      terrainExaggeration: 1.5 / terrainProvider.RADIUS_SCALAR,
      displayQuality: DisplayQuality.High,
    },
    h(ImageryLayers)
  );
};

const About = () => {
  return h("div.about", {}, []);
};

const UI = () => {
  const ref = useRef();
  return h(Router, [
    h("div.content", { ref }, [
      h(TitleBlock),
      h(Switch, [
        h(Route, { path: "/about" }, [h(About)]),
        h(Route, { path: "/list" }, [h(PositionListEditor, { positions })]),
        h(Route, { path: "/" }, [
          h(TextPanel, { positions, scrollParentRef: ref }),
        ]),
      ]),
    ]),
  ]);
};

const AppMain = () => {
  return h("div.app-ui", [
    h("div.left", null, h(UI)),
    h("div.right", null, [h(Viewer), h(CopyPositionButton)]),
  ]);
};

const App = () =>
  h("div.app-container", null, h(Provider, { store }, h(AppMain)));

export default App;
