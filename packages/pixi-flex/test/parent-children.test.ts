import { beforeAll, describe, expect, test } from 'vitest'
import { FlexContainer, initPixiFlexLayout } from '../src'
import { Yoga } from '../src/init'

describe('map pixi container to yoga node', () => {
  beforeAll(async () => {
    await initPixiFlexLayout()
  })

  test('yoga node equality', () => {
    const parent = Yoga.Node.create()
    const child = Yoga.Node.create()
    parent.insertChild(child, 0)
    // fails to check equality
    // so in following tests, we only check child count
    expect(parent).toBe(child.getParent())

    parent.freeRecursive()
  })

  test('add & remove child', () => {
    const parent = new FlexContainer()
    const child = new FlexContainer()
    parent.addChild(child)
    expect(parent.node.getChildCount()).toBe(1)
    expect(child.node.getParent()).toBeTruthy()

    parent.removeChild(child)
    expect(parent.node.getChildCount()).toBe(0)
    expect(child.node.getParent()).toBeFalsy()

    parent.destroy()
    child.destroy()
  })
})
