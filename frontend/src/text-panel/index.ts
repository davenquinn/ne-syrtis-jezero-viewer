import {hyperStyled} from "@macrostrat/hyper";
import html from "../../text/output/text.html"
import styles from "./main.styl"
import {useEffect, useRef, useState} from 'react'
import {PositionListEditor} from '../editor'
import positions from '../positions.js'
import {useDispatch} from 'react-redux'
import {debounce} from "underscore"
import classNames from "classnames"

const h = hyperStyled(styles)

const onIntersection = (dispatch)=> (entries, observer)=>{
  for (const e of entries) {
    if (!e.isIntersecting) continue
    const loc = e.target.getAttribute("data-location")
    console.log(e.target)
    dispatch({type: "fly-to-named-location", value: loc, positions})
  }
}

const TextPanel = (props)=>{
  const ref = useRef<HTMLElement>()
  const {scrollParentRef, positions} = props

  const dispatch = useDispatch()


  const [offsetCache, setCache] = useState([])

  const onScroll = ()=>{
    const scrollPos = scrollParentRef.current.scrollTop
    const pos = scrollPos + 250
    let selected = offsetCache[0]
    for (const offs of offsetCache) {
      if (offs.offset > pos) break
      selected = offs
    }
    if (selected.offset < scrollPos-100) {
      // Don't do anything if we've scrolled too far
      return
    }

    // Set up class name
    const elements = ref.current.querySelectorAll(`[data-location]`);
    for (const e of elements) {
      const elName = e.getAttribute("data-location")
      e.className = classNames(styles["location-link"], {active: elName == selected.name})
    }
    // Dispatch the location
    dispatch({type: "fly-to-named-location", value: selected.name, positions})
  }

  let scrollHandler = debounce(onScroll, 200)


  useEffect(()=>{
      if (ref.current == null || scrollParentRef.current == null ) return
      let cache = []
      //const sensor = ref.current.querySelector(".intersection-sensor")
      const elements = ref.current.querySelectorAll("[data-location]");

      scrollParentRef.current.onscroll = scrollHandler

      for (const e of elements) {
        e.className = styles["location-link"]

        const name = e.getAttribute("data-location")
        e.id = name

        cache.push({name, offset: e.offsetTop})
      }

      setCache(cache)



    }, [ref.current])

  return h("div.text-panel", {ref}, [
    h("div.text", {dangerouslySetInnerHTML: {__html: html}})
  ])
}

const Sidebar = ()=>{
  return  h("div.left", [
    h("div.content", [
      h(TextPanel, {positions}),
      h(PositionListEditor, {positions})
    ])
  ])
}

export {TextPanel, Sidebar}
