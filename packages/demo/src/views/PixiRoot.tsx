import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { Application, Container } from 'pixi.js'

interface Props {
  init: (app: Application) => Promise<Container>
}

const PixiRoot = forwardRef<Container, Props>(function PixiRoot({ init }: Props, ref) {
  const [rootNode, setRootNode] = useState<Container | null>(null)

  const initCallback = useCallback(async () => {
    const app = new Application()
    // @ts-expect-error connect to devtools
    globalThis.__PIXI_APP__ = app
    await app.init({ width: 640, height: 360 })
    document.getElementById('pixi-root')!.appendChild(app.canvas)
    return await init(app)
  }, [init])

  useEffect(() => {
    initCallback().then(root => setRootNode(root))
    return () => {
      document.getElementById('pixi-root')!.innerHTML = ''
    }
  }, [initCallback])

  useImperativeHandle(ref, () => rootNode!, [rootNode])

  return <div id="pixi-root"></div>
})

export default PixiRoot
