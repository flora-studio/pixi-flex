import { beforeAll, describe, expect, test } from 'vitest'
import { FlexContainer, initPixiFlexLayout } from '../src'
import { FlexDirection } from 'yoga-layout'

describe('init test', () => {
  beforeAll(async () => {
    await initPixiFlexLayout()
  })

  test('init by constructor options', () => {
    const options = { flexWidth: 100, flexDirection: FlexDirection.Row }
    const flexContainer = new FlexContainer(options)
    expect(flexContainer.flexWidth).toBe(100)
    expect(flexContainer.flexDirection).toBe(FlexDirection.Row)
  })
})
