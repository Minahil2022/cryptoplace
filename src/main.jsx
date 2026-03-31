import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import CoinContextProvider from './context/CoinContext.jsx'
import AuthContextProvider from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <CoinContextProvider>
          <App />
        </CoinContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
