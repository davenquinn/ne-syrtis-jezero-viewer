import h from "@macrostrat/hyper";
import { render } from "react-dom";
import App from "./app";

const base = document.createElement("div");
base.id = "app-container";
document.body.appendChild(base);

render(h(App), base);
