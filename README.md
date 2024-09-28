# @florastudio/pixi-flex

PixiJS flex layout lib, powered by [Yoga](https://www.yogalayout.dev/)

- [x] work with pixijs v8
- [ ] react-pixi-flex
- [ ] pixi v7 support?
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
  const child = new FlexContainer()
  child.addChild(Sprite.from(bunny))
  root.addChild(child)
}
```

The concept is simple: a FlexContainer represents a Yoga node, and all continuous FlexContainers build up a Yoga tree.

For more demo and usages, see [demo page](https://flora-studio.github.io/pixi-flex/) and [demo code](https://github.com/flora-studio/pixi-flex/tree/master/packages/demo/src).
