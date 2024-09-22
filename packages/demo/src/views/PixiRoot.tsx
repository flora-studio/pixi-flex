import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { FlexContainer } from '@flora-studio/pixi-flex'
import { Application } from 'pixi.js'

interface Props {
  init: (app: Application) => Promise<FlexContainer>
}

const PixiRoot = forwardRef<FlexContainer, Props>(function PixiRoot({ init }: Props, ref) {
  const rootNodeRef = useRef<FlexContainer | null>(null)

  const initCallback = useCallback(async () => {
    const app = new Application()
    // @ts-expect-error connect to devtools
    globalThis.__PIXI_APP__ = app
    await app.init({ width: 640, height: 360 })
    document.getElementById('pixi-root')!.appendChild(app.canvas)
    return await init(app)
  }, [init])

  useEffect(() => {
    initCallback().then(root => rootNodeRef.current = root)
    return () => {
      document.getElementById('pixi-root')!.innerHTML = ''
    }
  }, [initCallback])

  useImperativeHandle(ref, () => rootNodeRef.current!)

  return <div id="pixi-root"></div>
})

export default PixiRoot
