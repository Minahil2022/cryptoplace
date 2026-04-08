import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import CoinContextProvider from './context/CoinContext.jsx'
import AuthContextProvider from './context/AuthContext.jsx'
import WalletContextProvider from './context/WalletContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <CoinContextProvider>
          <WalletContextProvider>
            <App />
          </WalletContextProvider>
        </CoinContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
