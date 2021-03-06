import { GlobeAction, GlobeState } from "cesium-viewer/actions";

enum MapBackend {
  Flat,
  Globe,
}

enum OverlayLayer {
  HiRISE = "hirise",
  CRISM = "crism",
  Geology = "geology",
  Rover = "rover",
}

type AppState = GlobeState & {
  overlayLayers: Set<OverlayLayer>;
  debug: boolean;
  mapBackend: MapBackend;
  moveOnScroll: boolean;
};

type ToggleOverlay = {
  type: "toggle-overlay";
  value: OverlayLayer;
};

type ToggleMapBackend = { type: "toggle-map-backend" };
type ToggleDebugger = { type: "toggle-debugger" };
type ToggleMoveOnScroll = {
  type: "toggle-move-on-scroll";
};

type AppAction =
  | GlobeAction
  | ToggleOverlay
  | ToggleMapBackend
  | ToggleDebugger
  | ToggleMoveOnScroll;

export { MapBackend, OverlayLayer, AppState, AppAction };
