import h from "@macrostrat/hyper";
import { render } from "react-dom";
import { FlatMap } from "./map";
import "./main.styl";

const App = () => {
  return h("div.app-container", [h(FlatMap)]);
};

export default App;
