import h from "../hyper";
import { useDispatch } from "react-redux";
import ReactJSON from "react-json-view";
import { useAPIResult } from "@macrostrat/ui-components";
import { GeographicLocation } from "cesium-viewer/position";

type LocationProps = { point: GeographicLocation };

function getArgsFromLocation(
  point: GeographicLocation
): { x: string; y: string } {
  const x = point.longitude.toFixed(5);
  const y = point.latitude.toFixed(5);
  return { x, y };
}

function SelectedLocationInner(props: LocationProps) {
  const res = useAPIResult("/unit-details", getArgsFromLocation(props.point));
  if (res == null) return h("p", "Loading...");

  if (!res.success) {
    return h("p", "Error fetching features!");
  }
  const selectedFeatures = res.data;
  return h(ReactJSON, { src: selectedFeatures });
}

export function SelectedLocation(props: LocationProps) {
  const dispatch = useDispatch();
  return h("div.modal-content", [
    h(
      "a.button",
      {
        href: "#",
        onClick() {
          dispatch({ type: "dismiss-selection-panel" });
        },
      },
      "Dismiss"
    ),
    h(SelectedLocationInner, props),
  ]);
}
