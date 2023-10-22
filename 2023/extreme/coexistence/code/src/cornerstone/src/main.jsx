import React from 'react'
import ReactDOM from 'react-dom/client'
import { default as App } from './app'
import "@/styles/index.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
