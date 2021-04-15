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

function UnitResult({ data }) {
  console.log(data);
  return h("div.unit-result", [
    h("div.unit-swatch", { style: { backgroundColor: data.color } }),
    h("div.description", [
      h("h4.unit-title", data.unit_id),
      h("div.map-id", data.map_id),
    ]),
  ]);
}

function SelectedLocationInner(props: LocationProps) {
  const res = useAPIResult("/unit-details", getArgsFromLocation(props.point));
  if (res == null) return h("p", "Loading...");

  if (!res.success) {
    return h("p", "Error fetching features!");
  }
  const selectedFeatures = res.data;

  if (selectedFeatures.length == 0)
    return h(
      "div.unit-results",
      null,
      h("div.empty-error", "No map units in this area")
    );

  return h("div.unit-results", [
    h("h2", "Map units at location"),
    selectedFeatures.map((d) => {
      return h(UnitResult, { data: d });
    }),
  ]);
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
