import { hyperStyled } from "@macrostrat/hyper";
import html from "../../text/output/text.html";
import styles from "./main.styl";
import { useEffect, useRef, useState } from "react";
import { PositionListEditor } from "../editor";
import positions from "../positions.js";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "underscore";
import classNames from "classnames";

const h = hyperStyled(styles);

const onIntersection = (dispatch) => (entries, observer) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const loc = e.target.getAttribute("data-location");
    console.log(e.target);
    dispatch({ type: "fly-to-named-location", value: loc, positions });
  }
};

const TextPanel = (props) => {
  const ref = useRef<HTMLElement>();
  const { scrollParentRef, positions } = props;

  const dispatch = useDispatch();

  const currentLocation = useSelector((s) => s.namedLocation);
  console.log(currentLocation);

  const [offsetCache, setCache] = useState([]);

  // Restyle selection on change
  const setSelectionStyles = () => {
    if (ref.current == null) return;
    console.log(currentLocation);
    // Set up "active" class name for selection
    const elements = ref.current.querySelectorAll(`[data-location]`);
    for (const e of elements) {
      const elName = e.getAttribute("data-location");
      e.className = classNames(styles["location-link"], {
        active: elName == currentLocation,
      });
    }
  };
  useEffect(setSelectionStyles, [currentLocation]);

  const onScroll = () => {
    const scrollPos = scrollParentRef.current.scrollTop;

    // Our reference position is 250 px below the top of the panel
    const pos = scrollPos + 250;
    let selected = offsetCache[0];
    for (const offs of offsetCache) {
      // If we have gone too far, stop selecting offsets
      if (offs.offset > pos) break;
      selected = offs;
    }
    // Don't do anything if we're already viewing this location
    if (selected.name == currentLocation) return;
    // Don't do anything if we've scrolled past all the items
    if (selected.offset + selected.height < scrollPos) return;

    // Dispatch the location
    dispatch({
      type: "fly-to-named-location",
      value: selected.name,
    });
  };

  let scrollHandler = onScroll; //debounce(onScroll, 10)

  useEffect(() => {
    if (ref.current == null || scrollParentRef.current == null) return;
    let cache = [];
    //const sensor = ref.current.querySelector(".intersection-sensor")
    const elements = ref.current.querySelectorAll("[data-location]");

    scrollParentRef.current.onscroll = scrollHandler;

    for (const e of elements) {
      e.className = styles["location-link"];

      const name = e.getAttribute("data-location");
      e.id = name;
      const { height } = e.getBoundingClientRect();

      cache.push({ name, offset: e.offsetTop, height });
    }

    setCache(cache);
  }, [ref.current]);

  return h("div.text-panel", { ref }, [
    h("div.text", { dangerouslySetInnerHTML: { __html: html } }),
  ]);
};

const Sidebar = () => {
  return h("div.left", [
    h("div.content", [
      h(TextPanel, { positions }),
      h(PositionListEditor, { positions }),
    ]),
  ]);
};

export { TextPanel, Sidebar };
