import { loadYoga, Yoga as YogaInstance } from 'yoga-layout/load'

let Yoga: YogaInstance | null = null

export async function initPixiFlexLayout() {
  Yoga = await loadYoga()
}

export { Yoga }
