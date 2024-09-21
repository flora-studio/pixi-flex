import { Unit } from 'yoga-layout/load'

type Value = {
  unit: Unit;
  value: number;
};

export type FormattedValue = number | 'auto' | `${number}%` | undefined

export function formatValue(value: Value): FormattedValue {
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
