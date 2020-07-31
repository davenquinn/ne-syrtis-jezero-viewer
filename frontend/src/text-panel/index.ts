import {hyperStyled} from "@macrostrat/hyper";
import html from "../../text/output/text.html"
import styles from "./main.styl"
import {useEffect, useRef} from 'react'

const h = hyperStyled(styles)

function onIntersection() {
  console.log(arguments)
}

const TextPanel = (props)=>{

  const ref = useRef<HTMLElement>()
  useEffect(()=>{
      if (ref.current == null) return

      const elements = document.querySelectorAll("[data-location]");

      let observer = new IntersectionObserver(onIntersection, { root: ref.current })

      for (const e of elements) {
        e.className = styles["location-link"]
        observer.observe(e)
      }



}, [ref])

  return h("div.text-panel", {ref}, [
    h("div.intersection-sensor"),
    h("div.text", {dangerouslySetInnerHTML: {__html: html}})
  ])
}

export {TextPanel}
