import {
  GlobeAction,
  GlobeState,
  reducer,
  createInitialState,
} from "cesium-viewer/actions";
import { flyToParams, CameraParams } from "cesium-viewer/position";
import { DisplayQuality } from "cesium-viewer";
import positions from "./positions.js";
import { createStore } from "redux";
import update from "immutability-helper";
import {
  getHashString,
  setHashString,
} from "@macrostrat/ui-components/lib/esm/util/query-string";

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

function getInitialPosition(hashVals: {
  [key: string]: string;
}): CameraParams | null {
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

function setHash(
  pos: CameraPosition,
  overlays: Set<OverlayLayer>,
  mapBackend: MapBackend,
  verticalExaggeration: number | null
) {
  let hash = buildPositionHash(pos);
  if (overlays.size > 0) {
    hash.overlays = Array.from(overlays).join(",");
  }
  if (mapBackend == MapBackend.Flat) {
    hash.mapBackend = "2d";
  }
  if (verticalExaggeration != null) {
    hash.ve = verticalExaggeration;
  }
  setHashString(hash);
}

const newReducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case "set-camera-position":
      // Hook into the camera position setter to change viewer hash
      setHash(
        action.value.camera,
        state.overlayLayers,
        state.mapBackend,
        state.verticalExaggeration
      );
      return reducer(state, action);
    case "toggle-overlay":
      let spec = {};
      if (state.overlayLayers.has(action.value)) {
        spec = { $remove: [action.value] };
      } else {
        spec = { $add: [action.value] };
      }
      let newState = update(state, { overlayLayers: spec });
      setHash(
        state.position.camera ?? state.position,
        newState.overlayLayers,
        newState.mapBackend,
        state.verticalExaggeration
      );
      return newState;
    case "toggle-debugger":
      return update(state, { debug: { $set: !state.debug } });
    case "toggle-move-on-scroll":
      return update(state, { moveOnScroll: { $set: !state.moveOnScroll } });
    case "toggle-map-backend":
      const mapBackend =
        state.mapBackend == MapBackend.Flat
          ? MapBackend.Globe
          : MapBackend.Flat;

      setHash(
        state.position.camera ?? state.position,
        state.overlayLayers,
        mapBackend,
        state.verticalExaggeration
      );
      return { ...state, mapBackend };
    default:
      return reducer(state, action);
  }
};

const { overlays, debug, mapBackend, ...hashVals } = getHashString() ?? {};
let initialPos = getInitialPosition(hashVals);
let namedLocation = null;
if (initialPos == null) {
  namedLocation = "initial";
  initialPos = positions[namedLocation];
}
let [ve] = getNumbers(hashVals, ["ve"]);

// Initial state
const globeState = createInitialState({
  positions,
  flyToProps: flyToParams(initialPos, {
    duration: 0,
    once: true,
  }),
  namedLocation,
  verticalExaggeration: ve ?? 1.5,
  // Set a lower display quality for mobile
  displayQuality: window.matchMedia("(max-width: 600px)").matches
    ? DisplayQuality.Low
    : DisplayQuality.High,
});

const initialState: AppState = {
  ...globeState,
  moveOnScroll: true,
  overlayLayers: new Set(
    (Array.isArray(overlays) ? overlays : [overlays]) ?? []
  ),
  mapBackend: mapBackend == "2d" ? MapBackend.Flat : MapBackend.Globe,
  debug: debug != null,
};

let store = createStore(
  newReducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export { MapBackend, OverlayLayer, AppState, AppAction, store };
