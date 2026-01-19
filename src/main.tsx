import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register'

registerSW({
  onOfflineReady() {
    console.log('PWA lista para uso offline')
  },
  onNeedRefresh() {
    console.log('Nueva versión disponible')
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/bjj_app_react">
      <App />
    </BrowserRouter>
  </React.StrictMode>
)