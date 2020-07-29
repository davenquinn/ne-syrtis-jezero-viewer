import h from "@macrostrat/hyper";
import { render } from "react-dom";
import { FlatMap } from "./map";
import CesiumView from "cesium-viewer";
import "./main.styl";

const App = () => {
  return h("div.app-container", [h(CesiumView), h(FlatMap)]);
};

export default App;
