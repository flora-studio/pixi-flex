import { Application, Assets, Sprite } from 'pixi.js'
import bunny from '../assets/bunny.png'
import { Align, FlexContainer, FlexDirection, Justify } from '@flora-studio/pixi-flex'
import PixiRoot from './PixiRoot.tsx'

async function init(app: Application) {
  await Assets.load(bunny)

  const root = new FlexContainer()
  root.label = 'root'
  root.flexWidth = 640
  root.flexHeight = 360
  root.flexDirection = FlexDirection.Row
  root.alignItems = Align.Center
  root.justifyContent = Justify.SpaceAround

  const icon1 = new FlexContainer()
  const sprite1 = Sprite.from(bunny)
  sprite1.anchor = 0.5
  icon1.addChild(sprite1)
  root.addChild(icon1)

  const icon2 = new FlexContainer()
  const sprite2 = Sprite.from(bunny)
  sprite2.anchor = 0.5
  sprite2.x = 13
  sprite2.y = 18.5
  icon2.addChild(sprite2)
  root.addChild(icon2)

  const icon3 = new FlexContainer()
  const sprite3 = Sprite.from(bunny)
  sprite3.anchor = 0.5
  icon3.on('flex-after-layout', ({ width, height }) => {
    sprite3.x = width / 2
    sprite3.y = height / 2
  })
  icon3.addChild(sprite3)
  root.addChild(icon3)

  app.stage.addChild(root)

  return root
}

function AnchorExample() {
  return (
    <div>
      <p>In PixiJS setting an anchor or pivot will affect the position. So you may need to set the offset manually.</p>
      <p>From left to right:</p>
      <ol>
        <li>Set anchor = 0.5, the sprite is not vertically centered</li>
        <li>Set a fixed offset</li>
        <li>Set a offset dynamically, according to sprite's size</li>
      </ol>
      <PixiRoot init={init} />
    </div>
  )
}

export default AnchorExample
