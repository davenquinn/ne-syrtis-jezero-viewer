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

function MapSource(props) {
  const { children, doi } = props;
  return h("li.map-source", [
    h("span.paper-title", children),
    " ",
    h(
      "a.doi-link",
      { href: props.href ?? "https://doi.org/" + doi, target: "_blank" },
      doi
    ),
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
    h("div.map-sources", [
      h("h4", "Geologic map sources"),
      h("ul", [
        h(
          MapSource,
          { doi: "10.1016/j.icarus.2017.03.030" },
          "Bramble et al., 2017"
        ),
        h(MapSource, { doi: "10.1002/2014JE004782" }, "Goudge et al., 2015"),
        h(
          MapSource,
          { doi: "10.1029/2018JE005706" },
          "Quinn and Ehlmann, 2019"
        ),
        h(MapSource, { doi: "10.3133/sim3464 " }, "Sun and Stack, 2020"),
      ]),
    ]),
    h("h3", "Base layers"),
    h(BaseLayerSelector),
  ]);
}
