import h from "@macrostrat/hyper";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import classNames from "classnames";
import { ActiveMapLayer } from "cesium-viewer/actions";
import { OverlayLayer } from "./state";
import update from "immutability-helper";

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
  const { id, children, doi } = props;
  let sources = useSelector((s) => s.visibleMaps);
  const dispatch = useDispatch();

  const selected = sources?.has(id) ?? true;
  const className = classNames({ selected });

  const onChange = useCallback(() => {
    let src: Set<string> = sources ?? new Set([]);
    let newSrc = src;
    if (src.has(id)) {
      newSrc = update(newSrc, { $remove: [id] });
    } else {
      newSrc = update(newSrc, { $add: [id] });
    }
    dispatch({ type: "toggle-map-visible", value: newSrc });
  }, [sources]);

  return h("li.map-source", { className }, [
    h("input", {
      type: "checkbox",
      checked: selected,
      onChange,
    }),
    " ",
    h("span.paper-title", children),
    " ",
    h(
      "a.doi-link",
      { href: props.href ?? "https://doi.org/" + doi, target: "_blank" },
      doi
    ),
  ]);
}

function LayerToggle({ name, layer }) {
  const overlays = useSelector((s) => s.overlayLayers);
  const dispatch = useDispatch();
  return h(LayerButton, {
    name,
    active: overlays.has(layer),
    onClick() {
      dispatch({ type: "toggle-overlay", value: layer });
    },
  });
}

function MapSourceSelector() {
  return h("div.map-sources", [
    h("h4", "Geologic map sources"),
    h("ul", [
      h(
        MapSource,
        { doi: "10.1016/j.icarus.2017.03.030", id: "syrtis_bramble" },
        "Bramble et al., 2017"
      ),
      h(
        MapSource,
        { doi: "10.1002/2014JE004782", id: "watershed_goudge" },
        "Goudge et al., 2015"
      ),
      h(
        MapSource,
        { doi: "10.1029/2018JE005706", id: "sulfates_quinn" },
        "Quinn and Ehlmann, 2019"
      ),
      h(
        MapSource,
        { doi: "10.3133/sim3464", id: "jezero_usgs" },
        "Sun and Stack, 2020"
      ),
    ]),
  ]);
}

export function LayerSelectorPanel() {
  return h("div.layer-selector", [
    h("h3", "Overlays"),
    h(LayerToggle, {
      name: "HiRISE imagery",
      description:
        "High-resolution imagery (up to 25 cm/pixel). Currently limited to the Perseverance landing site.",
      layer: OverlayLayer.HiRISE,
    }),
    h(LayerToggle, {
      name: "CRISM",
      layer: OverlayLayer.CRISM,
    }),
    h(LayerToggle, {
      name: "Geologic map",
      layer: OverlayLayer.Geology,
    }),
    h(LayerToggle, { name: "Rover position", layer: OverlayLayer.Rover }),
    h(MapSourceSelector),
    h("h3", "Base layers"),
    h(BaseLayerSelector),
  ]);
}
