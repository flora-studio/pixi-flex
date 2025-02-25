import { Application, extend } from '@pixi/react'
import { Graphics } from 'pixi.js'

extend({ Graphics })

export function ReactExample() {
  return (
    <Application autoStart sharedTicker width={640} height={360}>
      <pixiGraphics draw={graphics => {
        graphics.clear()
        graphics.setFillStyle({ color: 'red' })
        graphics.rect(0, 0, 100, 100)
        graphics.fill()
      }} />
    </Application>
  )
}
