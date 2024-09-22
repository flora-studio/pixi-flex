import { Application, Assets, Sprite, Texture, Text, TextStyle } from 'pixi.js'
import bunny from '../assets/bunny.png'
import { Align, FlexContainer, FlexDirection, Justify, PositionType } from '@flora-studio/pixi-flex'
import PixiRoot from './PixiRoot.tsx'

async function init(app: Application) {
  await Assets.load(bunny)
  const textStyle = new TextStyle({ fill: 0xff00ff })

  const root = new FlexContainer()
  root.label = 'root'
  root.flexWidth = 640
  root.flexHeight = 360
  root.alignItems = Align.Center
  root.justifyContent = Justify.Center

  const dialog = new FlexContainer()
  dialog.label = 'dialog'
  dialog.padding = 20
  dialog.flexDirection = FlexDirection.Column
  dialog.alignItems = Align.Center
  dialog.rowGap = 10
  root.addChild(dialog)

  const dialogBackground = new FlexContainer()
  dialogBackground.label = 'background'
  dialogBackground.positionType = PositionType.Absolute
  dialogBackground.left = 0
  dialogBackground.top = 0
  // dialogBackground.right = 0
  // dialogBackground.bottom = 0
  dialogBackground.flexWidth = '100%'
  dialogBackground.flexHeight = '100%'
  const backgroundSprite = new Sprite(Texture.WHITE)
  dialogBackground.on('flex-after-layout', ({ width, height }) => {
    backgroundSprite.width = width
    backgroundSprite.height = height
  })
  dialogBackground.addChild(backgroundSprite)
  dialog.addChild(dialogBackground)

  const title = new FlexContainer()
  title.label = 'title'
  const titleText = new Text({ text: 'You got a bunny!', style: textStyle })
  title.addChild(titleText)
  dialog.addChild(title)

  const icon = new FlexContainer()
  icon.label = 'icon'
  const sprite = Sprite.from(bunny)
  sprite.anchor = 0.5
  icon.on('flex-after-layout', ({ width, height }) => {
    console.log('flex-after-layout', width, height)
    sprite.x = width / 2
    sprite.y = height / 2
    // sprite.rotation = -Math.PI / 2
  })
  icon.addChild(sprite)
  dialog.addChild(icon)

  const buttons = new FlexContainer()
  buttons.label = 'buttons'
  buttons.flexWidth = 200
  buttons.flexDirection = FlexDirection.Row
  buttons.justifyContent = Justify.SpaceBetween
  dialog.addChild(buttons)

  const cancelBtn = new FlexContainer()
  cancelBtn.label = 'cancelBtn'
  const cancelText = new Text({ text: 'Cancel', style: textStyle })
  cancelBtn.addChild(cancelText)
  buttons.addChild(cancelBtn)

  const confirmBtn = new FlexContainer()
  confirmBtn.label = 'confirmBtn'
  const confirmText = new Text({ text: 'Confirm', style: textStyle })
  confirmBtn.addChild(confirmText)
  buttons.addChild(confirmBtn)

  app.stage.addChild(root)

  return root
}

function NestedExample() {
  return <PixiRoot init={init} />
}

export default NestedExample
