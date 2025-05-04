# @florastudio/pixi-flex

## DEPRECATED

Since the official [@pixi/layout](https://github.com/pixijs/layout) package v3 has already refactored in Yoga, we recommend using the official package instead.

---

PixiJS flex layout lib, powered by [Yoga](https://www.yogalayout.dev/)

- [x] work with pixijs v8
- [x] work with @pixi/react v8

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

## Tips

### Difference between `undefined` and `auto` in `flexWidth`/`flexHeight`
If a `FlexContainer` is not a leaf node, they are the same.

If it's a leaf node, then the default behavior (`undefined`) is, it will measure itself real width/height and set to Yoga node. This is the most common use case.

However, sometimes you will need Yoga to decide the leaf node's size, and then set to the pixi component. In this case you can set `flexWidth`/`flexHeight` to `auto` to tell the `FlexContainer` do not measure, but let Yoga calculate.

For example:
```javascript
// let a sprite to match parent
const container = new FlexContainer({
  positionType: PositionType.Absolute,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  flexWidth: 'auto',
  flexHeight: 'auto'
})

const sprite = new Sprite()
container.on(FLEX_AFTER_LAYOUT, ({ width, height }) => {
  sprite.width = width
  sprite.height = height
})
```
