import { createContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'
export const MetaMaskContext = createContext()

const MetaMaskContextProvider = (props) => {
  // ==============================
  // ETHERS / METAMASK STATE
  // ==============================
  const { user } = useContext(AuthContext)
  const [provider, setProvider] = useState(null)

  const [signer, setSigner] = useState(null)

  const [walletAddress, setWalletAddress] =
    useState(null)

  const [isConnected, setIsConnected] =
    useState(false)

  const [chainId, setChainId] = useState(null)

  const useEthers =
    import.meta.env.VITE_USE_ETHERS === 'true'

  // ==============================
  // CONNECT WALLET
  // ==============================
const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })

    const connectedAddress = accounts[0]

    const browserProvider =
      new ethers.BrowserProvider(window.ethereum)

    const connectedSigner =
      await browserProvider.getSigner()

    const network =
      await browserProvider.getNetwork()

    setProvider(browserProvider)
    setSigner(connectedSigner)
    setWalletAddress(connectedAddress)
    setChainId(network.chainId.toString())
    setIsConnected(true)

    localStorage.setItem(
      'connectedWallet',
      JSON.stringify(connectedAddress)
    )

    console.log(
      'Wallet connected:',
      connectedAddress
    )

    // Save wallet in database
    if (user?.id) {
      const response = await fetch(
        'http://localhost:3000/api/wallets/connect',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            walletAddress:
              connectedAddress,
            chainId:
              network.chainId.toString(),
          }),
        }
      )

      const data =
        await response.json()

      console.log(
        'Wallet saved to database:',
        data
      )
    }

    return {
      success: true,
      walletAddress:
        connectedAddress,
    }
  } catch (err) {
    console.error(
      'Wallet connect error:',
      err
    )

    return {
      success: false,
      message: err.message,
    }
  }
}

  // ==============================
  // AUTO RECONNECT
  // ==============================

  useEffect(() => {
    const reconnectWallet = async () => {
      try {
        if (!window.ethereum) return

        const accounts =
          await window.ethereum.request({
            method: 'eth_accounts',
          })

        if (accounts.length === 0) return

        const browserProvider =
          new ethers.BrowserProvider(
            window.ethereum
          )

        const connectedSigner =
          await browserProvider.getSigner()

        const network =
          await browserProvider.getNetwork()

        setProvider(browserProvider)

        setSigner(connectedSigner)

        setWalletAddress(accounts[0])

        setChainId(network.chainId.toString())

        setIsConnected(true)
      } catch (error) {
        console.error(
          'Reconnect wallet error:',
          error
        )
      }
    }

    reconnectWallet()
  }, [])

  // ==============================
  // DISCONNECT
  // ==============================

  const disconnectWallet = () => {
    setProvider(null)

    setSigner(null)

    setWalletAddress(null)

    setChainId(null)

    setIsConnected(false)

    localStorage.removeItem(
      'connectedWallet'
    )
  }

  // ==============================
  // METAMASK EVENTS
  // ==============================

  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (
      accounts
    ) => {
      setWalletAddress(
        accounts[0] || null
      )

      setIsConnected(
        accounts.length > 0
      )
    }

    const handleChainChanged = () => {
      window.location.reload()
    }

    window.ethereum.on(
      'accountsChanged',
      handleAccountsChanged
    )

    window.ethereum.on(
      'chainChanged',
      handleChainChanged
    )

    return () => {
      if (!window.ethereum) return

      window.ethereum.removeListener(
        'accountsChanged',
        handleAccountsChanged
      )

      window.ethereum.removeListener(
        'chainChanged',
        handleChainChanged
      )
    }
  }, [])

  // ==============================
  // CONTEXT VALUE
  // ==============================

  const contextValue = {
    provider,
    signer,
    walletAddress,
    isConnected,
    chainId,
    useEthers,

    connectWallet,
    disconnectWallet,
  }

  return (
    <MetaMaskContext.Provider
      value={contextValue}
    >
      {props.children}
    </MetaMaskContext.Provider>
  )
}

export default MetaMaskContextProvider