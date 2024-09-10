import { beforeAll, describe, expect, test } from 'vitest'
import { FlexContainer, initPixiFlexLayout } from '../src'
import { FlexDirection, Gutter } from 'yoga-layout'

describe('layout nodes', () => {
  beforeAll(async () => {
    await initPixiFlexLayout()
  })

  test('basic', () => {
    const parent = new FlexContainer()
    parent.node.setFlexDirection(FlexDirection.Row)
    parent.node.setWidth(100)
    parent.node.setHeight(100)
    parent.node.setGap(Gutter.Column, 10)

    const child0 = new FlexContainer()
    child0.node.setFlexGrow(1)
    parent.addChild(child0)
    child0.on('flex-after-layout', args => console.log('Child0', JSON.stringify(args)))

    const child1 = new FlexContainer()
    child1.node.setFlexGrow(1)
    parent.addChild(child1)
    child1.on('flex-after-layout', args => console.log('Child0', JSON.stringify(args)))

    parent.doLayout()
    const child0Result = child0.node.getComputedLayout()
    const child1Result = child1.node.getComputedLayout()
    expect(child0Result.left).toBe(0)
    expect(child0Result.width).toBe(45)
    expect(child1Result.left).toBe(55)
    expect(child1Result.width).toBe(45)
  })
})
