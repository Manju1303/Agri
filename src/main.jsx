import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerServiceWorker, requestPersistentStorage } from './utils/pwa.js'

// Register Service Worker for PWA support
registerServiceWorker();

// Request persistent storage
requestPersistentStorage();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
