import { beforeAll, describe, expect, test } from 'vitest'
import { FlexContainer, initPixiFlexLayout } from '../src'
import { FlexDirection } from 'yoga-layout'

describe('layout nodes', () => {
  beforeAll(async () => {
    await initPixiFlexLayout()
  })

  test('basic', () => {
    const parent = new FlexContainer()
    parent.flexDirection = FlexDirection.Row
    parent.flexWidth = 100
    parent.flexHeight = 100
    parent.columnGap = 10

    const child0 = new FlexContainer()
    child0.flexGrow = 1
    parent.addChild(child0)

    const child1 = new FlexContainer()
    child1.flexGrow = 1
    parent.addChild(child1)

    parent.doLayout()
    const child0Result = child0.node.getComputedLayout()
    const child1Result = child1.node.getComputedLayout()
    expect(child0Result.left).toBe(0)
    expect(child0Result.width).toBe(45)
    expect(child1Result.left).toBe(55)
    expect(child1Result.width).toBe(45)
  })
})
