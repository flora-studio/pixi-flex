import { loadYoga, Yoga as YogaInstance, Config } from 'yoga-layout/load'

let Yoga: YogaInstance | undefined = undefined
let YogaConfig: Config | undefined = undefined

export type YogaInitFunc = (config: Config) => void

export async function initPixiFlexLayout(init?: YogaInitFunc) {
  Yoga = await loadYoga()
  YogaConfig = Yoga.Config.create()
  if (init) {
    init(YogaConfig)
  }

  return () => void YogaConfig?.free()
}

export { Yoga, YogaConfig }
