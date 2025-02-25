import { useState } from 'react'
import BasicExample from './views/basic.tsx'
import NestedExample from './views/nested.tsx'
import AnchorExample from './views/anchor.tsx'
import TextExample from './views/text.tsx'
import VisibleExample from './views/visible.tsx'
import { ReactExample } from './views/reactDemo.tsx'

const demos = [
  {
    name: 'Basic Example',
    source: 'basic.tsx',
    renderer: () => <BasicExample />,
  },
  {
    name: 'Nested Example',
    source: 'nested.tsx',
    renderer: () => <NestedExample />,
  },
  {
    name: 'Deal with anchor',
    source: 'anchor.tsx',
    renderer: () => <AnchorExample />,
  },
  {
    name: 'Respond to size change',
    source: 'text.tsx',
    renderer: () => <TextExample />
  },
  {
    name: 'Renderable vs Visible',
    source: 'visible.tsx',
    renderer: () => <VisibleExample />,
  },
  {
    name: 'React Example',
    source: 'reactDemo.tsx',
    renderer: () => <ReactExample />
  }
]

const sourceBase = 'https://github.com/flora-studio/pixi-flex/blob/master/packages/demo/src/views/'

function App() {

  const [index, setIndex] = useState(0)

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        {demos.map((demo, i) => <button key={demo.name} onClick={() => setIndex(i)}>{demo.name}</button>)}
      </div>
      <div>
        <a href={`${sourceBase}${demos[index].source}`} target="_blank">View source</a>
      </div>
      <div style={{ padding: '10px', border: '1px solid #ccc', display: 'inline-block' }}>
        {demos[index].renderer()}
      </div>
    </div>
  )
}

export default App
