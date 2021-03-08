import { hyperStyled } from "@macrostrat/hyper";
import { useRef, useState, memo } from "react";
import { Provider, useSelector } from "react-redux";
import {
  CTXLayer,
  MarsHillshadeLayer,
  SyrtisTerrainProvider,
  CRISMLayer,
  MOLALayer,
  GeologyLayer,
  HiRISELayer,
} from "./layers";

import CesiumViewer from "cesium-viewer";
import { OverlayLayer } from "./state";
import styles from "./main.styl";

import { ImageryLayerCollection } from "resium";
import { LayerSelectorPanel } from "./layer-selector";
import { TitleBlock } from "./title-block";
import { TextPanel } from "./text-panel";
import { ActiveMapLayer } from "cesium-viewer/actions";
import { PositionListEditor, CopyPositionButton } from "./editor";
import positions from "./positions.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { RoverPosition } from "./rover-position";
import mainText from "../text/output/main.html";
import viewerText from "../text/output/viewer.html";
import changelogText from "../text/output/changelog.html";
import { FlatMap } from "./map";
import { MapBackend, store } from "./state";

const h = hyperStyled(styles);

const ImageryLayers = () => {
  const mapLayer = useSelector((s) => s.mapLayer);
  const overlays = useSelector((s) => s.overlayLayers);
  return h([
    h(ImageryLayerCollection, null, [
      h(MOLALayer),
      h.if(mapLayer == ActiveMapLayer.CTX)(CTXLayer),
      h.if(mapLayer == ActiveMapLayer.Hillshade)(MarsHillshadeLayer),
    ]),
    h(ImageryLayerCollection, null, [
      h.if(overlays.has(OverlayLayer.HiRISE))(HiRISELayer),
      h.if(overlays.has(OverlayLayer.CRISM))(CRISMLayer),
      h.if(overlays.has(OverlayLayer.Geology))(GeologyLayer),
      h.if(overlays.has(OverlayLayer.Rover))(RoverPosition),
    ]),
  ]);
};

const terrainProvider = new SyrtisTerrainProvider();

const Viewer = () => {
  const displayQuality = useSelector((s) => s.displayQuality);
  const exaggeration = useSelector((s) => s.verticalExaggeration);
  const debug = useSelector((s) => s.debug);

  return h(
    CesiumViewer,
    {
      terrainProvider,
      terrainExaggeration: exaggeration / terrainProvider.RADIUS_SCALAR,
      displayQuality,
      showInspector: debug,
    },
    h(ImageryLayers)
  );
};

const MemViewer = memo(Viewer);

const baseURL = process.env.PUBLIC_URL ?? "/";

const UI = () => {
  const ref = useRef();
  return h(Router, { basename: baseURL }, [
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
          h(Route, { path: "/layers" }, h(LayerSelectorPanel)),
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
  const mapBackend = useSelector((s) => s.mapBackend);

  return h("div.app-ui", [
    h.if(showUI)("div.left", null, h(UI)),
    h("div.right", null, [
      mapBackend == MapBackend.Globe ? h(MemViewer) : h(FlatMap),
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
