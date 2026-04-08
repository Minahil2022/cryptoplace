import { createContext, useState, useEffect } from 'react'

export const WalletContext = createContext()

const WalletContextProvider = (props) => {
  const [wallet, setWallet] = useState({
    userId: null,
    fiatBalance: {
      USD: 10000.00,
      EUR: 8000.00,
    },
    cryptoHoldings: {},
    lastUpdated: new Date().toISOString(),
  })

  const [transactionHistory, setTransactionHistory] = useState([])

  // Initialize wallet from localStorage on mount
  useEffect(() => {
    const storedWallet = localStorage.getItem('userWallet')
    if (storedWallet) {
      try {
        const parsedWallet = JSON.parse(storedWallet)
        setWallet(parsedWallet)
      } catch (error) {
        console.error('Failed to retrieve stored wallet:', error)
      }
    }
  }, [])

  // Save wallet to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userWallet', JSON.stringify(wallet))
  }, [wallet])

  /**
   * Initialize wallet for a user (called on signup/login)
   * @param {number} userId
   * @param {object} initialBalance - Optional: { USD: 10000, ... }
   */
  const initializeWallet = (userId, initialBalance = null) => {
    const newWallet = {
      userId,
      fiatBalance: initialBalance || {
        USD: 10000.00,
        EUR: 8000.00,
      },
      cryptoHoldings: {},
      lastUpdated: new Date().toISOString(),
    }
    setWallet(newWallet)
    setTransactionHistory([])
  }

  /**
   * Clear wallet on logout
   */
  const clearWallet = () => {
    setWallet({
      userId: null,
      fiatBalance: { USD: 10000.00, EUR: 8000.00 },
      cryptoHoldings: {},
      lastUpdated: new Date().toISOString(),
    })
    setTransactionHistory([])
    localStorage.removeItem('userWallet')
  }

  /**
   * Get balance in a specific currency
   * @param {string} currencyCode - e.g., 'USD', 'EUR'
   * @returns {number}
   */
  const getBalance = (currencyCode = 'USD') => {
    return wallet.fiatBalance[currencyCode] || 0
  }

  /**
   * Get crypto holdings for a specific coin
   * @param {string} coinSymbol - e.g., 'btc', 'eth'
   * @returns {number}
   */
  const getCryptoHolding = (coinSymbol) => {
    return wallet.cryptoHoldings[coinSymbol.toLowerCase()] || 0
  }

  /**
   * Deduct fiat amount after buying crypto (optimistic update)
   * @param {string} currencyCode
   * @param {number} amount
   */
  const deductFiatBalance = (currencyCode, amount) => {
    setWallet((prev) => ({
      ...prev,
      fiatBalance: {
        ...prev.fiatBalance,
        [currencyCode]: prev.fiatBalance[currencyCode] - amount,
      },
      lastUpdated: new Date().toISOString(),
    }))
  }

  /**
   * Add fiat amount after selling crypto (optimistic update)
   * @param {string} currencyCode
   * @param {number} amount
   */
  const addFiatBalance = (currencyCode, amount) => {
    setWallet((prev) => ({
      ...prev,
      fiatBalance: {
        ...prev.fiatBalance,
        [currencyCode]: prev.fiatBalance[currencyCode] + amount,
      },
      lastUpdated: new Date().toISOString(),
    }))
  }

  /**
   * Add crypto holdings (optimistic update)
   * @param {string} coinSymbol
   * @param {number} quantity
   */
  const addCryptoHolding = (coinSymbol, quantity) => {
    const symbol = coinSymbol.toLowerCase()
    setWallet((prev) => ({
      ...prev,
      cryptoHoldings: {
        ...prev.cryptoHoldings,
        [symbol]: (prev.cryptoHoldings[symbol] || 0) + quantity,
      },
      lastUpdated: new Date().toISOString(),
    }))
  }

  /**
   * Remove crypto holdings (optimistic update)
   * @param {string} coinSymbol
   * @param {number} quantity
   */
  const removeCryptoHolding = (coinSymbol, quantity) => {
    const symbol = coinSymbol.toLowerCase()
    setWallet((prev) => ({
      ...prev,
      cryptoHoldings: {
        ...prev.cryptoHoldings,
        [symbol]: Math.max(0, (prev.cryptoHoldings[symbol] || 0) - quantity),
      },
      lastUpdated: new Date().toISOString(),
    }))
  }

  /**
   * Update entire wallet (called after successful backend transaction)
   * @param {object} updatedWallet
   */
  const updateWallet = (updatedWallet) => {
    setWallet({
      ...updatedWallet,
      lastUpdated: new Date().toISOString(),
    })
  }

  /**
   * Add transaction to history
   * @param {object} transaction
   */
  const addTransaction = (transaction) => {
    setTransactionHistory((prev) => [transaction, ...prev])
  }

  const contextValue = {
    wallet,
    transactionHistory,
    initializeWallet,
    clearWallet,
    getBalance,
    getCryptoHolding,
    deductFiatBalance,
    addFiatBalance,
    addCryptoHolding,
    removeCryptoHolding,
    updateWallet,
    addTransaction,
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {props.children}
    </WalletContext.Provider>
  )
}

export default WalletContextProvider
