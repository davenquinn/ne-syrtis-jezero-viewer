import { hyperStyled } from "@macrostrat/hyper";
import styles from "./main.styl";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { DisplayQuality } from "cesium-viewer";
import { MapBackend } from "./state";

const h = hyperStyled(styles);

const Link = ({ to, children, ...rest }) => {
  return h(
    "li",
    null,
    h(NavLink, { to, activeClassName: styles["is-active"], ...rest }, children)
  );
};

const Control = (props) => {
  const { options, title, onChange, selected } = props;
  return h("span.control", [
    h.if(title != null)("span.control-title", title + ":"),
    h(
      Object.entries(options).map((d) => {
        const onClick = (e) => {
          onChange(d[1]);
          e.preventDefault();
        };
        let main;
        if (d[1] == selected) {
          main = h("span.option.selected", { key: d[0] }, d[0]);
        } else {
          main = h("a.option", { href: "#", onClick, key: d[0] }, d[0]);
        }
        return h([" ", main]);
      })
    ),
  ]);
};

const QualityControl = () => {
  const selected = useSelector((s) => s.displayQuality);
  const dispatch = useDispatch();
  const options = {
    low: DisplayQuality.Low,
    high: DisplayQuality.High,
  };
  const onChange = (value: DisplayQuality) =>
    dispatch({ type: "set-display-quality", value });
  return h(Control, { title: "Quality", options, selected, onChange });
};

const DebuggerControl = () => {
  const debug = useSelector((s) => s.debug);
  const dispatch = useDispatch();
  return h(
    "a.control",
    {
      href: "#",
      onClick(e) {
        dispatch({ type: "toggle-debugger" });
        e.preventDefault();
      },
    },
    (debug ? "hide" : "show") + " debugger"
  );
};

const ExaggerationControl = () => {
  const selected = useSelector((s) => s.verticalExaggeration);
  const dispatch = useDispatch();

  const options = {
    none: 1,
    "1.5x": 1.5,
    "2x": 2,
  };
  const onChange = (value: number) =>
    dispatch({ type: "set-exaggeration", value });
  return h(Control, {
    title: "terrain exaggeration",
    options,
    selected,
    onChange,
  });
};

function MapTypeControl() {
  const mapBackend = useSelector((s) => s.mapBackend);
  const dispatch = useDispatch();
  const options = {
    "3d": MapBackend.Globe,
    "2d": MapBackend.Flat,
  };
  return h(Control, {
    options,
    selected: mapBackend,
    onChange() {
      dispatch({ type: "toggle-map-backend" });
    },
  });
}

const MiniControls = () => {
  return h("div.mini-controls", [
    h(QualityControl),
    ", ",
    h(ExaggerationControl),
    ", ",
    h(MapTypeControl),
    // ", ",
    // h(DebuggerControl),
    ".",
  ]);
};

const SoftwareInfo = () => {
  return h("div.software-info", [
    h("p.version", [
      `${NPM_VERSION} – ${COMPILE_DATE}`,
      " (",
      h(NavLink, { to: "/changelog" }, "changelog"),
      ", ",
      h("a", { href: GITHUB_REV_LINK }, GIT_COMMIT_HASH),
      ")",
    ]),
    h(
      "p.directions",
      "Navigate by scrolling. \
       Drag the 3D display to pan, Ctrl+drag to rotate."
    ),
    h(MiniControls),
  ]);
};

const TitleBlock = () => {
  return h("div.title-block", [
    h("h1.title", [
      "Jezero Crater's context within northeast Syrtis Major",
      h("span.subtitle", " — a multiscale interactive explorer"),
    ]),
    h("div.auth-affil", [
      h(
        "h3.author",
        null,
        h("a", { href: "https://davenquinn.com" }, "Daven Quinn")
      ),
      h("h4.affiliation", [
        "University of Wisconsin – Madison, ",
        h("a", { href: "https://macrostrat.org" }, "Macrostrat"),
      ]),
    ]),
    h(SoftwareInfo),
    h(
      "nav",
      null,
      h("ul", [
        h(Link, { to: "/", exact: true }, "Story"),
        h(Link, { to: "/about" }, "The viewer"),
        h(Link, { to: "/layers" }, "Layers"),
        h(Link, { to: "/list", className: styles["positions"] }, "#"),
      ])
    ),
  ]);
};

export { TitleBlock, Link, Control };
