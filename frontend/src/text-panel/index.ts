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
    const pos = scrollParentRef.current.scrollTop + 250
    let selected = offsetCache[0].name
    for (const {name, offset} of offsetCache) {
      if (offset > pos) break
      selected = name
    }
    // Set up class name
    const elements = ref.current.querySelectorAll(`[data-location]`);
    for (const e of elements) {
      const elName = e.getAttribute("data-location")
      e.className = classNames(styles["location-link"], {active: elName == selected})
    }
    // Dispatch the location
    dispatch({type: "fly-to-named-location", value: selected, positions})
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
        //const dv = document.createElement("div")
        //dv.className = styles["handle"]
        //e.appendChild(dv)
        //observer.observe(e)
        const name = e.getAttribute("data-location")
        //const {height} = e.getBoundingClientRect()
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
