import h, { styles } from "~/hyper";
import { useEffect, useRef, useState, useCallback } from "react";
import { PositionListEditor } from "../editor";
import positions from "../positions.js";
import { useDispatch, useSelector } from "react-redux";
import { Control } from "../title-block";
import classNames from "classnames";
import typeset from "typeset";

const buildPositionCache = (container: HTMLElement) => {
  let cache = [];
  const elements = container.querySelectorAll("[data-location]");
  const { scrollTop } = container.offsetParent;
  const { top: containerTop } = container.offsetParent.getBoundingClientRect();

  for (const e of elements) {
    const name = e.getAttribute("data-location");
    e.id = name;
    const { top, height } = e.getBoundingClientRect();
    const data = { name, top: top + scrollTop - containerTop, height };
    cache.push(data);
  }
  return cache;
};

const scrollRefOffset = window.matchMedia("(max-width: 600px)").matches
  ? 100
  : 250;

const TextPanelControls = () => {
  const moveOnScroll = useSelector((s) => s.moveOnScroll);
  const dispatch = useDispatch();
  return h("div.page-controls", [
    h(Control, {
      title: "Move on scroll",
      selected: moveOnScroll,
      onChange() {
        dispatch({
          type: "toggle-move-on-scroll",
        });
      },
      options: { on: true, off: false },
    }),
  ]);
};

const TextPanel = (props) => {
  const ref = useRef<HTMLElement>();
  const { scrollParentRef, html } = props;

  const dispatch = useDispatch();
  const [offsetCache, setCache] = useState([]);

  const currentLocation = useSelector((s) => s.namedLocation);
  const moveOnScroll = useSelector((s) => s.moveOnScroll);

  // Restyle selection on change
  const setSelectionStyles = () => {
    if (ref?.current == null) return;
    // Set up "active" class name for selection
    const elements = ref.current.querySelectorAll(`[data-location]`);
    for (const e of elements) {
      const elName = e.getAttribute("data-location");
      e.className = classNames(styles["location-link"], {
        active: elName == currentLocation,
      });
    }
  };
  useEffect(setSelectionStyles, [currentLocation, ref, html]);

  const onScroll = (evt) => {
    const scrollPos = scrollParentRef.current.scrollTop;

    // Our reference position is 250 px below the top of the panel
    const pos = scrollPos + scrollRefOffset;
    let selected = offsetCache[0];
    for (const offs of offsetCache) {
      // If we have gone too far, stop selecting offsets
      if (offs.top > pos) break;
      selected = offs;
    }
    if (selected == null) return;
    if (!moveOnScroll) return;

    // Don't do anything if we're already viewing this location
    if (selected.name == currentLocation) return;
    // Don't do anything if we've scrolled past all the items
    if (selected.offset + selected.height < pos) return;

    // Dispatch the location
    dispatch({
      type: "fly-to-named-location",
      value: selected.name,
    });
  };

  useEffect(() => {
    scrollParentRef.current.onscroll = onScroll;
  }, [offsetCache, moveOnScroll]);

  // CLICK HANDLERS - COULD NOT GET THIS TO WORK QUITE RIGHT
  // Navigate by click or arrow keys
  let navigateTo = useCallback(function () {
    const elName = this.getAttribute("data-location");
    dispatch({
      type: "fly-to-named-location",
      value: elName,
    });
  }, []);

  // Set up initial handlers, etc.
  useEffect(() => {
    if (ref?.current == null || scrollParentRef.current == null) return;

    console.log("Setting up positions cache");

    // We set a 1 second timeout here to make sure we are getting correctly laid-out
    // positions. This is an annoying bug.
    setTimeout(() => {
      const cache = buildPositionCache(ref.current);
      setCache(cache);
    }, 1000);

    setSelectionStyles();

    const elements = ref.current.querySelectorAll(`[data-location]`);
    for (const e of elements) {
      const elName = e.getAttribute("data-location");
      if (elName != null) e.addEventListener("click", navigateTo);
    }
  }, [ref, html]);

  const __html = typeset(html);

  /*
  const keyDownHandler = (event) => {
    switch (event.which) {
      case 38: // up
        return navigateTo(offsetCache[currentIndex + 1]);
      case 40: // down
        return navigateTo(offsetCache[currentIndex - 1]);
    }
    event.preventDefault(); // prevent the default action (scroll / move caret)
  };

  // Set up initial handlers, etc.
  useEffect(() => {
    // Bind up and down arrow keys to navigate items
    document.addEventListener("keydown", keyDownHandler);
    // Return a function to destroy event handlers
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [ref, offsetCache, currentLocation]);
  */

  return h("div.text-panel", { ref }, [
    h(TextPanelControls),
    //h("div.scroll-indicator"),
    h("div.text", { dangerouslySetInnerHTML: { __html } }),
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
