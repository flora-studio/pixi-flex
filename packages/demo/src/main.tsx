import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initPixiFlexLayout } from '@florastudio/pixi-flex'

initPixiFlexLayout().then(() => {
  createRoot(document.getElementById('root')!).render(<App />)
})
