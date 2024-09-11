import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initPixiFlexLayout } from '@flora-studio/pixi-flex'

initPixiFlexLayout().then(() => {
  createRoot(document.getElementById('root')!).render(<App />)
})
