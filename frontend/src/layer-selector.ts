import h from "@macrostrat/hyper";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import { ActiveMapLayer } from "cesium-viewer/actions";
import { OverlayLayer } from "./state";

const LayerButton = (props) => {
  const { name, active, ...rest } = props;
  const className = classNames({ "is-active": active });
  return h("a.layer-button", { className, ...rest }, name);
};

function BaseLayerSelector() {
  const dispatch = useDispatch();
  const baseLayer = useSelector((s) => s.mapLayer);
  return h("div.button-group", [
    h(LayerButton, {
      name: "CTX global mosaic",
      active: baseLayer == ActiveMapLayer.CTX,
      onClick() {
        console.log("Changing map layer");
        dispatch({ type: "set-map-layer", value: ActiveMapLayer.CTX });
      },
    }),
    h(LayerButton, {
      name: "Hillshade",
      active: baseLayer == ActiveMapLayer.Hillshade,
      onClick() {
        console.log("Changing map layer");
        dispatch({ type: "set-map-layer", value: ActiveMapLayer.Hillshade });
      },
    }),
  ]);
}

export function LayerSelectorPanel() {
  const dispatch = useDispatch();
  const overlays = useSelector((s) => s.overlayLayers);
  return h("div.layer-selector", [
    h("h3", "Overlays"),
    h(LayerButton, {
      name: "CRISM",
      active: overlays.has(OverlayLayer.CRISM),
      onClick() {
        dispatch({ type: "toggle-overlay", value: OverlayLayer.CRISM });
      },
    }),
    h(LayerButton, {
      name: "Geologic map",
      active: overlays.has(OverlayLayer.Geology),
      onClick() {
        dispatch({ type: "toggle-overlay", value: OverlayLayer.Geology });
      },
    }),
    h("h3", "Base layers"),
    h(BaseLayerSelector),
  ]);
}
