/// <reference types="vite/client" />

import type { Container } from 'pixi.js'
import type { PixiReactElementProps } from '@pixi/react'
import type { FlexContainer } from '@florastudio/pixi-flex'

declare module '@pixi/react' {
  interface PixiElements {
    flexContainer: PixiReactElementProps<typeof FlexContainer<Container>>;
  }
}
