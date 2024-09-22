import BasicExample from './views/basic.tsx'
import NestedExample from './views/nested.tsx'
import { useState } from 'react'

const demos = [
  {
    name: 'Basic Example',
    renderer: () => <BasicExample />,
  },
  {
    name: 'Nested Example',
    renderer: () => <NestedExample />,
  }
]

function App() {

  const [index, setIndex] = useState(0)

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        {demos.map((demo, i) => <button key={demo.name} onClick={() => setIndex(i)}>{demo.name}</button>)}
      </div>
      <div style={{ padding: '10px', border: '1px solid #ccc', display: 'inline-block' }}>
        {demos[index].renderer()}
      </div>
    </div>
  )
}

export default App
