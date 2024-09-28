import { Application, Text, TextStyle } from 'pixi.js'
import { FLEX_AFTER_LAYOUT, FlexContainer } from '@flora-studio/pixi-flex'
import PixiRoot from './PixiRoot.tsx'
import { ChangeEvent, useRef, useState } from 'react'

const WIDTH = 200

async function init(app: Application) {
  const root = new FlexContainer()
  root.flexWidth = WIDTH
  root.padding = 20
  root.gap = 20

  const text1 = createTextNode()
  root.addChild(text1)

  const text2 = createTextNode()
  text2.flexWidth = '100%'
  text2.on(FLEX_AFTER_LAYOUT, ({ width }) => {
    const pixiText = text2.getChildAt(0) as Text
    pixiText.width = width
  })
  root.addChild(text2)

  const text3 = createTextNode()
  text3.flexWidth = '100%'
  text3.on(FLEX_AFTER_LAYOUT, ({ width }) => {
    const pixiText = text3.getChildAt(0) as Text
    pixiText.style.wordWrap = true
    pixiText.style.wordWrapWidth = width
  })
  root.addChild(text3)

  app.stage.addChild(root)
  return root
}

function createTextNode() {
  const node = new FlexContainer()
  const text = new Text({ text: 'Hello world from PixiJS', style: new TextStyle({ fill: 0xffff00 }) })
  node.addChild(text)
  return node
}

function TextExample() {
  const rootNodeRef = useRef<FlexContainer | null>(null)
  const [rootWidth, setRootWidth] = useState(WIDTH)
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    setRootWidth(newValue)
    const root = rootNodeRef.current
    if (root) {
      root.flexWidth = newValue
    }
  }

  return (
    <div>
      <p>Sometimes the computed size does not match original size. You decide how to deal with it.</p>
      <p>From top to bottom:</p>
      <ol>
        <li>Let it overflow</li>
        <li>Resize to match the computed width</li>
        <li>Word wrap at the computed width</li>
      </ol>
      <div style={{ marginBottom: '1rem' }}>
        <label>Set parent width: </label>
        <input type="number" value={rootWidth} onChange={onInputChange}/>
      </div>
      <PixiRoot ref={rootNodeRef} init={init}/>
    </div>
  )
}

export default TextExample
