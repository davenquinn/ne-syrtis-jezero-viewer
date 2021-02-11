import { hyperStyled } from "@macrostrat/hyper";
import { useRef, useState } from "react";
import { Provider, useSelector } from "react-redux";
import { createStore } from "redux";
import { CTXLayer, HillshadeLayer, SyrtisTerrainProvider } from "./layers";
import {
  setHashString,
  getHashString,
} from "@macrostrat/ui-components/lib/esm/util/query-string";

import CesiumViewer, { DisplayQuality } from "cesium-viewer";
import styles from "./main.styl";

import { TitleBlock } from "./title-block";
import { TextPanel } from "./text-panel";
import {
  reducer,
  ActiveMapLayer,
  createInitialState,
  GlobeAction,
  GlobeState,
} from "cesium-viewer/actions";
import { PositionListEditor, CopyPositionButton } from "./editor";
import positions from "./positions.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { flyToParams, CameraParams } from "cesium-viewer/position";
import mainText from "../text/output/main.html";
import viewerText from "../text/output/viewer.html";
import changelogText from "../text/output/changelog.html";

const h = hyperStyled(styles);

interface PositionHashParams {
  x: string;
  y: string;
  z?: string;
  e?: string;
  a?: string;
}

function buildPositionHash(pos: CameraParams): PositionHashParams {
  let res: PositionHashParams = {
    x: pos.longitude.toFixed(3),
    y: pos.latitude.toFixed(3),
    z: pos.height.toFixed(0),
  };

  const elevationAngle = Math.round(90 + pos.pitch);
  if (elevationAngle != 0) {
    res.e = elevationAngle.toFixed(0);
  }

  let az = Math.round(pos.heading);
  if (az >= 360) az -= 360;
  if (az < 0) az += 360;
  if (az != 0) res.a = az.toFixed(0);

  return res;
}

function setPositionHash(pos: CameraParams) {
  setHashString(buildPositionHash(pos));
}

type NumberOrNull = number | null;

function getNumbers(
  obj: { [k: string]: string },
  keys: string[]
): NumberOrNull[] {
  return keys.map((d) => {
    const num = parseFloat(obj[d]);
    return isNaN(num) ? null : num;
  });
}

function getInitialPosition(): CameraParams | null {
  const hashVals = getHashString();
  if (hashVals == null) return null;
  const [x, y, z, e, a] = getNumbers(hashVals, ["x", "y", "z", "e", "a"]);
  if (x == null && y == null) return null;
  let pos = {
    longitude: x,
    latitude: y,
    height: z ?? 5000,
    heading: a ?? 0,
    pitch: -90 + (e ?? 0),
    roll: 0,
  };
  console.log("Setting initial position from hash: ", pos);
  return pos;
}

const newReducer = (state: GlobeState, action: GlobeAction) => {
  switch (action.type) {
    case "set-camera-position":
      // Hook into the camera position setter to change viewer hash
      setPositionHash(action.value.camera);
      return reducer(state, action);
    default:
      return reducer(state, action);
  }
};

let initialPos = getInitialPosition();
let namedLocation = null;
if (initialPos == null) {
  namedLocation = "initial";
  initialPos = positions[namedLocation];
}
console.log(initialPos);

const initialState = createInitialState({
  positions,
  flyToProps: flyToParams(initialPos, {
    duration: 0,
    once: true,
  }),
  namedLocation,
  verticalExaggeration: 1.5,
  // Set a lower display quality for mobile
  displayQuality: window.matchMedia("(max-width: 600px)").matches
    ? DisplayQuality.Low
    : DisplayQuality.High,
});
let store = createStore(
  newReducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const ImageryLayers = () => {
  const mapLayer = useSelector((s) => s.mapLayer);
  return h([
    h.if(mapLayer != ActiveMapLayer.Hillshade)(CTXLayer),
    h.if(mapLayer == ActiveMapLayer.Hillshade)(HillshadeLayer),
  ]);
};

const terrainProvider = new SyrtisTerrainProvider();

const Viewer = () => {
  const displayQuality = useSelector((s) => s.displayQuality);
  const exaggeration = useSelector((s) => s.verticalExaggeration);

  return h(
    CesiumViewer,
    {
      terrainProvider,
      terrainExaggeration: exaggeration / terrainProvider.RADIUS_SCALAR,
      displayQuality,
    },
    h(ImageryLayers)
  );
};

const UI = () => {
  const ref = useRef();
  return h(Router, [
    h("div.left-panel", { ref }, [
      h("div.content", [
        h(TitleBlock),
        h(Switch, [
          h(Route, { path: "/changelog" }, [
            h(TextPanel, { html: changelogText, scrollParentRef: ref }),
          ]),
          h(Route, { path: "/about" }, [
            h(TextPanel, { html: viewerText, scrollParentRef: ref }),
          ]),
          h(Route, { path: "/list" }, [h(PositionListEditor, { positions })]),
          h(Route, { path: "/" }, [
            h(TextPanel, { html: mainText, scrollParentRef: ref }),
          ]),
        ]),
      ]),
    ]),
  ]);
};

function ShowUIButton(props) {
  const { onClick, enabled } = props;
  const text = enabled ? "Hide UI" : "Show UI";
  return h("a.show-ui-button", { onClick }, text);
}

const AppMain = () => {
  const [showUI, setShowUI] = useState(true);
  return h("div.app-ui", [
    h.if(showUI)("div.left", null, h(UI)),
    h("div.right", null, [
      h(Viewer),
      h(CopyPositionButton),
      h(ShowUIButton, {
        enabled: showUI,
        onClick() {
          setShowUI(!showUI);
        },
      }),
    ]),
  ]);
};

const App = () =>
  h("div.app-container", null, h(Provider, { store }, h(AppMain)));

export default App;
