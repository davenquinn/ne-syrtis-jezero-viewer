import h from "@macrostrat/hyper";
import { useSelector, useDispatch } from 'react-redux'
import {CopyToClipboard} from 'react-copy-to-clipboard';

const FlyToButton = ({camera, children})=>{
  const dispatch = useDispatch()
  return h("a.fly-to", {onClick() {
    dispatch({type: "fly-to-position", value: camera})
  }}, children)
}

const CopyPositionButton = ()=>{
  const pos = useSelector(s => s.position?.camera)
  let text = ""
  if (pos != null) {
    text = JSON.stringify(pos, (key, val)=>{
      return val.toFixed ? Number(val.toFixed(3)) : val;
    })
  }
  return h(CopyToClipboard, {text, onCopy(){
    console.log(text)
  }}, h("button", "Copy current position"))
}

const PositionListEditor = ({positions})=>{
  return h("div.positions-panel", [
    h("h1", "Positions"),
    h("div.position-list", Object.entries(positions).map(entry => {
      const [k,v] = entry
      return h("p", null, h(FlyToButton, {camera: v}, k))
    })),
    h(CopyPositionButton)
  ])
}

export {PositionListEditor, CopyPositionButton, FlyToButton}
