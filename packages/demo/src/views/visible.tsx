import { Application, Text, TextStyle } from 'pixi.js'
import { FlexContainer } from '@florastudio/pixi-flex'
import { ChangeEvent, useRef, useState } from 'react'
import PixiRoot from './PixiRoot.tsx'

async function init(app: Application) {
  const root = new FlexContainer()
  root.padding = 20
  root.gap = 20

  const text1 = createTextNode(1)
  root.addChild(text1)

  const text2 = createTextNode(2)
  root.addChild(text2)

  const text3 = createTextNode(3)
  root.addChild(text3)

  app.stage.addChild(root)
  return root
}

function createTextNode(i: number) {
  const node = new FlexContainer()
  const text = new Text({ text: `Line ${i}`, style: new TextStyle({ fill: 0xffff00 }) })
  node.addChild(text)
  return node
}

const options = ['renderable ✅ / visible ✅', 'renderable ❎ / visible ✅', 'renderable ✅ / visible ❎']

function VisibleExample() {
  const rootNodeRef = useRef<FlexContainer | null>(null)

  const [selectedOption, setOption] = useState(0)
  const onOptionChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value)
    setOption(value)
    const child = rootNodeRef.current?.getChildAt(1)
    if (child) {
      if (value === 0) {
        child.renderable = true
        child.visible = true
      } else if (value === 1) {
        child.renderable = false
        child.visible = true
      } else {
        child.renderable = true
        child.visible = false
      }
    }
  }

  return (
    <div>
      <p>`renderable: false` is like `visibility: hidden` in CSS</p>
      <p>`visible: false` is like `display: none` in CSS</p>
      <div>
        {options.map((option, i) => (
          <div key={option}>
            <input
              type="radio"
              name="justifyContent"
              value={i}
              id={option}
              checked={selectedOption === i}
              onChange={onOptionChange}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
      </div>
      <PixiRoot ref={rootNodeRef} init={init}/>
    </div>
  )
}

export default VisibleExample
