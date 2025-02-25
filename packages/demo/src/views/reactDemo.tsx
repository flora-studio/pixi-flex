import { Application, extend } from '@pixi/react'
import { Container, Text } from 'pixi.js'
import { useState } from 'react'
import { FlexContainer, FlexDirection } from '@florastudio/pixi-flex'

extend({ Container, FlexContainer, Text })

export function ReactExample() {
  const [list, setList] = useState(() => [1, 2, 3, 4, 5])

  console.log(list.slice())

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setList(suffle)}>Shuffle</button>
      </div>
      <Application autoStart sharedTicker width={640} height={360}>
        <pixiContainer y={50}>
          {list.map((id, i) => <pixiText key={id} text={String(id)} style={{ fill: 'white' }} x={34 * i} />)}
        </pixiContainer>
        {/*<pixiGraphics draw={graphics => {*/}
        {/*  graphics.clear()*/}
        {/*  graphics.setFillStyle({ color: 'red' })*/}
        {/*  graphics.rect(0, 0, 100, 100)*/}
        {/*  graphics.fill()*/}
        {/*}} />*/}
        <flexContainer flexDirection={FlexDirection.Row} gap={20}>
          {list.map((id, i) => (
            <flexContainer key={id} label={String(id)}>
              <pixiText text={String(id)} style={{ fill: 'white' }} />
            </flexContainer>
          ))}
        </flexContainer>
      </Application>

    </div>
  )
}

function suffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return [...array]
}
