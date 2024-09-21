import { Application, Assets, Sprite } from 'pixi.js'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import bunny from '../assets/bunny.png'
import { FlexContainer, FlexDirection, Justify } from '@flora-studio/pixi-flex'

async function init() {
  const app = new Application()
  await app.init({ width: 640, height: 360 })
  document.getElementById('example-basic')!.appendChild(app.canvas)
  await Assets.load(bunny)

  const root = new FlexContainer()
  root.flexWidth = 640
  root.flexDirection = FlexDirection.Row
  root.justifyContent = Justify.SpaceBetween

  for (let i = 0; i < 3; i++) {
    const sprite = createSpriteContainer()
    root.addChild(sprite)
  }
  app.stage.addChild(root)

  return root
}

function createSpriteContainer() {
  const container = new FlexContainer()
  const sprite = Sprite.from(bunny)
  container.addChild(sprite)
  return container
}

const options = [
  { name: 'FlexStart', value: Justify.FlexStart },
  { name: 'Center', value: Justify.Center },
  { name: 'FlexEnd', value: Justify.FlexEnd },
  { name: 'SpaceBetween', value: Justify.SpaceBetween },
  { name: 'SpaceAround', value: Justify.SpaceAround },
]

function BasicExample() {
  const rootNodeRef = useRef<FlexContainer | null>(null)
  useEffect(() => {
    init().then(root => rootNodeRef.current = root)
    return () => {
      document.getElementById('example-basic')!.innerHTML = ''
    }
  }, [])

  const [justifyContent, setJustifyContent] = useState<Justify>(Justify.SpaceBetween)
  const onOptionChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value) as Justify
    setJustifyContent(value)
    const root = rootNodeRef.current
    if (root) {
      root.justifyContent = value
    }
  }

  return (
    <div>
      <div>
        {options.map(option => (
          <div key={option.name}>
            <input
              type="radio"
              name="justifyContent"
              value={option.value}
              id={option.name}
              checked={justifyContent === option.value}
              onChange={onOptionChange}
            />
            <label htmlFor={option.name}>{option.name}</label>
          </div>
        ))}
      </div>
      <div id="example-basic"></div>
    </div>
  )
}

export default BasicExample
