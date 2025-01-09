# @florastudio/pixi-flex

PixiJS flex layout lib, powered by [Yoga](https://www.yogalayout.dev/)

- [x] work with pixijs v8
- [x] work with @pixi/react v8
- [ ] animation

## Installation

```shell
npm install @florastudio/pixi-flex
```

## How to use

First call init function:

```javascript
import { initPixiFlexLayout } from '@florastudio/pixi-flex'

await initPixiFlexLayout()
```

Config Yoga if you need:

```javascript
await initPixiFlexLayout(config => {
  config.setUseWebDefaults(true)
})
```

See [Yoga document](https://www.yogalayout.dev/docs/getting-started/configuring-yoga) for all config.

Replace `PIXI.Container` with `FlexContainer` if you want this node to be flex.

```javascript
import { FlexContainer, FlexDirection, Justify } from '@florastudio/pixi-flex'

const root = new FlexContainer()
root.flexWidth = 640
root.flexDirection = FlexDirection.Row
root.justifyContent = Justify.SpaceBetween

for (let i = 0; i < 3; i++) {
  const child = new FlexContainer() // NOTE THIS!
  child.addChild(Sprite.from(bunny))
  root.addChild(child)
}
```

The concept is simple: 

A `FlexContainer` represents a Yoga node, and all continuous `FlexContainer` build up a Yoga tree.

That's why in the above demo code, every Sprite is wrapped by a `FlexContainer`, so they are 3 dependant Yoga nodes.

For more demo and usages, see [demo page](https://flora-studio.github.io/pixi-flex/) and [demo code](https://github.com/flora-studio/pixi-flex/tree/master/packages/demo/src).

### Use with @pixi/react
```jsx
import { extend, useAssets } from '@pixi/react'
import { initPixiFlexLayout, FlexContainer, FlexDirection, Justify } from '@florastudio/pixi-flex'

await initPixiFlexLayout()

extend({ FlexContainer })

function Bunny() {
  const { assets: [texture], isSuccess } = useAssets(['https://pixijs.com/assets/bunny.png'])

  return isSuccess && (
    <flexContainer>
      <pixiSprite texture={texture} />
    </flexContainer>
  )
}

function Main() {
  return (
    <flexContainer flexWidth={640} flexDirection={FlexDirection.Row} justifyContent={Justify.SpaceBetween}>
      <Bunny />
      <Bunny />
      <Bunny />
    </flexContainer>
  )
}
```
