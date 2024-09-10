import { beforeAll, describe, expect, test } from 'vitest'
import { FlexContainer, initPixiFlexLayout } from '../src'
import { Container } from 'pixi.js'

describe('root-leaf test', () => {
  beforeAll(async () => {
    await initPixiFlexLayout()
  })

  test('check is flex root', () => {
    const flexContainer = new FlexContainer()
    expect(flexContainer.isFlexRoot).toBe(true)
    const flexParent = new FlexContainer()
    flexParent.addChild(flexContainer)
    expect(flexContainer.isFlexRoot).toBe(false)
  })

  test('flex under non-flex container is root', () => {
    const flexContainer = new FlexContainer()
    const parent = new Container()
    parent.addChild(flexContainer)
    expect(flexContainer.isFlexRoot).toBe(true)
  })

  test('check is flex leaf', () => {
    const flexContainer = new FlexContainer()
    expect(flexContainer.isFlexLeaf).toBe(true)
    const flexChild = new FlexContainer()
    flexContainer.addChild(flexChild)
    expect(flexContainer.isFlexLeaf).toBe(false)
  })

  test('flex has non-flex children is leaf', () => {
    const flexContainer = new FlexContainer()
    const child = new Container()
    flexContainer.addChild(child)
    expect(flexContainer.isFlexLeaf).toBe(true)
  })
})
