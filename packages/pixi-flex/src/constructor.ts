import type { ContainerOptions, ContainerChild } from 'pixi.js'
import type { FormattedValue, FormattedValueWithAuto } from './utils.ts'
import type { Align, Direction, FlexDirection, Wrap, Justify, Overflow, PositionType } from 'yoga-layout/load'

export interface FlexContainerOptions<C extends ContainerChild> extends ContainerOptions<C> {
  flexWidth?: FormattedValueWithAuto
  flexHeight?: FormattedValueWithAuto
  visible?: boolean
  alignContent?: Align
  alignItems?: Align
  alignSelf?: Align
  aspectRatio?: number
  borderTop?: number
  borderRight?: number
  borderBottom?: number
  borderLeft?: number
  borderStart?: number
  borderEnd?: number
  borderHorizontal?: number
  borderVertical?: number
  border?: number
  direction?: Direction
  flex?: number
  flexBasis?: FormattedValueWithAuto
  flexDirection?: FlexDirection
  flexGrow?: number
  flexShrink?: number
  flexWrap?: Wrap
  justifyContent?: Justify
  gap?: FormattedValue
  rowGap?: FormattedValue
  columnGap?: FormattedValue
  marginTop?: FormattedValueWithAuto
  marginRight?: FormattedValueWithAuto
  marginBottom?: FormattedValueWithAuto
  marginLeft?: FormattedValueWithAuto
  marginStart?: FormattedValueWithAuto
  marginEnd?: FormattedValueWithAuto
  marginHorizontal?: FormattedValueWithAuto
  marginVertical?: FormattedValueWithAuto
  margin?: FormattedValueWithAuto
  maxHeight?: FormattedValue
  maxWidth?: FormattedValue
  minHeight?: FormattedValue
  minWidth?: FormattedValue
  overflow?: Overflow
  paddingTop?: FormattedValue
  paddingRight?: FormattedValue
  paddingBottom?: FormattedValue
  paddingLeft?: FormattedValue
  paddingStart?: FormattedValue
  paddingEnd?: FormattedValue
  paddingHorizontal?: FormattedValue
  paddingVertical?: FormattedValue
  padding?: FormattedValue
  top?: FormattedValue
  right?: FormattedValue
  bottom?: FormattedValue
  left?: FormattedValue
  start?: FormattedValue
  end?: FormattedValue
  positionType?: PositionType
}

const FlexContainerSpecificKeys = Object.freeze<(keyof FlexContainerOptions<ContainerChild>)[]>([
  'flexWidth',
  'flexHeight',
  'visible',
  'alignContent',
  'alignItems',
  'alignSelf',
  'aspectRatio',
  'borderTop',
  'borderRight',
  'borderBottom',
  'borderLeft',
  'borderStart',
  'borderEnd',
  'borderHorizontal',
  'borderVertical',
  'border',
  'direction',
  'flex',
  'flexBasis',
  'flexDirection',
  'flexGrow',
  'flexShrink',
  'flexWrap',
  'justifyContent',
  'gap',
  'rowGap',
  'columnGap',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginStart',
  'marginEnd',
  'marginHorizontal',
  'marginVertical',
  'margin',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'overflow',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingStart',
  'paddingEnd',
  'paddingHorizontal',
  'paddingVertical',
  'padding',
  'top',
  'right',
  'bottom',
  'left',
  'start',
  'end',
  'positionType'
])

export function splitConstructorOptions<C extends ContainerChild>(options: FlexContainerOptions<C> = {}) {
  const containerOptions: ContainerOptions<C> = {}
  const flexOptions: FlexContainerOptions<C> = {}
  let children: C[] | undefined = undefined
  for (const key in options) {
    const typedKey = key as keyof FlexContainerOptions<C>
    if (typedKey === 'children') {
      children = options[typedKey]
    } else if (FlexContainerSpecificKeys.includes(typedKey)) {
      // @ts-ignore
      flexOptions[typedKey] = options[typedKey]
    } else {
      // @ts-ignore
      containerOptions[typedKey] = options[typedKey]
    }
  }
  return { containerOptions, flexOptions, children }
}
