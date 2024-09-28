import { Unit } from 'yoga-layout/load'

// from Yoga
type Value = {
  unit: Unit
  value: number
}

export type FormattedValue = number | `${number}%` | undefined
export type FormattedValueWithAuto = FormattedValue | 'auto'

export function formatValue(value: Value): FormattedValueWithAuto {
  switch (value.unit) {
    case Unit.Undefined:
      return undefined
    case Unit.Auto:
      return 'auto'
    case Unit.Point:
      return value.value
    case Unit.Percent:
      return `${value.value}%`
  }
}

export const FLEX_AFTER_LAYOUT = 'flex-after-layout'
