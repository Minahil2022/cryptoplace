import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'

import App from './App.jsx'

import CoinContextProvider from './context/CoinContext.jsx'
import AuthContextProvider from './context/AuthContext.jsx'
import WalletContextProvider from './context/WalletContext.jsx'
import MetaMaskContextProvider from './context/MetaMaskContext.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <CoinContextProvider>
          <WalletContextProvider>
            <MetaMaskContextProvider>
              <App />
            </MetaMaskContextProvider>
          </WalletContextProvider>
        </CoinContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
)