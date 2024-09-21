import { Application, Assets, Sprite, Texture, Text, TextStyle } from 'pixi.js'
import bunny from '../assets/bunny.png'
import { Align, FlexContainer, FlexDirection, Justify, PositionType } from '@flora-studio/pixi-flex'
import { useEffect } from 'react'

async function init() {
  const app = new Application()
  globalThis.__PIXI_APP__ = app
  await app.init({ width: 640, height: 360 })
  document.getElementById('example-nested')!.appendChild(app.canvas)
  await Assets.load(bunny)
  const textStyle = new TextStyle({ fill: 0xff00ff })

  const root = new FlexContainer()
  root.flexTag = 'root'
  root.flexWidth = 640
  root.flexHeight = 360
  root.alignItems = Align.Center
  root.justifyContent = Justify.Center

  const dialog = new FlexContainer()
  dialog.flexTag = 'dialog'
  dialog.padding = 20
  dialog.flexDirection = FlexDirection.Column
  dialog.alignItems = Align.Center
  dialog.rowGap = 10
  // dialog.alignItems = Align.Center
  // dialog.justifyContent = Justify.Center
  root.addChild(dialog)

  const dialogBackground = new FlexContainer()
  dialogBackground.flexTag = 'background'
  dialogBackground.positionType = PositionType.Absolute
  dialogBackground.left = 0
  dialogBackground.top = 0
  // dialogBackground.right = 0
  // dialogBackground.bottom = 0
  dialogBackground.flexWidth = '100%'
  dialogBackground.flexHeight = '100%'
  const backgroundSprite = new Sprite(Texture.WHITE)
  dialogBackground.on('flex-after-layout', ({ width, height }) => {
    console.log('flex-after-layout', width, height)
    backgroundSprite.width = width
    backgroundSprite.height = height
  })
  dialogBackground.addChild(backgroundSprite)
  dialog.addChild(dialogBackground)

  const title = new FlexContainer()
  title.flexTag = 'title'
  const titleText = new Text({ text: 'You got a bunny!', style: textStyle })
  title.addChild(titleText)
  dialog.addChild(title)

  const icon = new FlexContainer()
  icon.flexTag = 'icon'
  const sprite = Sprite.from(bunny)
  // sprite.anchor = 0.5
  icon.addChild(sprite)
  dialog.addChild(icon)

  const buttons = new FlexContainer()
  buttons.flexTag = 'buttons'
  buttons.flexWidth = 200
  buttons.flexDirection = FlexDirection.Row
  buttons.justifyContent = Justify.SpaceBetween
  dialog.addChild(buttons)

  const cancelBtn = new FlexContainer()
  cancelBtn.flexTag = 'cancelBtn'
  const cancelText = new Text({ text: 'Cancel', style: textStyle })
  cancelBtn.addChild(cancelText)
  buttons.addChild(cancelBtn)

  const confirmBtn = new FlexContainer()
  confirmBtn.flexTag = 'confirmBtn'
  const confirmText = new Text({ text: 'Confirm', style: textStyle })
  confirmBtn.addChild(confirmText)
  buttons.addChild(confirmBtn)

  app.stage.addChild(root)
}

function NestedExample() {
  useEffect(() => {
    init()
    return () => {
      document.getElementById('example-nested')!.innerHTML = ''
    }
  }, [])
  return <div id="example-nested"></div>
}

export default NestedExample
