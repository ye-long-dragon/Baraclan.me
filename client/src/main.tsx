import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import '@fontsource/montserrat/700.css'
import '@fontsource/oswald/400.css'
import '@fontsource/oswald/500.css'
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
