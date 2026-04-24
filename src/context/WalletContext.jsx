import { createContext, useContext, useEffect, useState } from 'react'
import WalletService from '../services/WalletService'
import TransactionService from '../services/TransactionService'
import { AuthContext } from './AuthContext'

export const WalletContext = createContext()

const DEFAULT_FIAT_BALANCE = {
  USD: 10000.0,
  EUR: 8000.0,
}

const EMPTY_WALLET = {
  userId: null,
  fiatBalance: { ...DEFAULT_FIAT_BALANCE },
  cryptoHoldings: {},
  lastUpdated: null,
}

const normalizeWallet = (walletData, fallbackUserId = null) => ({
  userId: walletData?.user_id ?? walletData?.userId ?? fallbackUserId ?? null,
  fiatBalance: walletData?.fiat_balance ?? walletData?.fiatBalance ?? { ...DEFAULT_FIAT_BALANCE },
  cryptoHoldings: walletData?.crypto_holdings ?? walletData?.cryptoHoldings ?? {},
  lastUpdated: walletData?.last_updated ?? walletData?.lastUpdated ?? new Date().toISOString(),
})

const normalizeTransaction = (transaction) => ({
  id: transaction?.id,
  type: transaction?.type,
  symbol: (transaction?.symbol ?? transaction?.coin_symbol ?? '').toLowerCase(),
  quantity: Number(transaction?.quantity ?? 0),
  usdAmount: Number(transaction?.usdAmount ?? transaction?.fiat_amount ?? 0),
  fee: Number(transaction?.fee ?? 0),
  currency: transaction?.currency ?? 'USD',
  currentPrice: Number(transaction?.currentPrice ?? transaction?.price_at_transaction ?? 0),
  timestamp: transaction?.timestamp ?? transaction?.created_dt ?? new Date().toISOString(),
  status: transaction?.status ?? transaction?.transaction_status ?? 'completed',
})

const WalletContextProvider = (props) => {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext)
  const [wallet, setWallet] = useState(EMPTY_WALLET)
  const [transactionHistory, setTransactionHistory] = useState([])
  const [walletLoading, setWalletLoading] = useState(false)

  const updateWallet = (updatedWallet) => {
    setWallet((prev) => normalizeWallet(updatedWallet, updatedWallet?.user_id ?? updatedWallet?.userId ?? prev.userId))
  }

  const addTransaction = (transaction) => {
    setTransactionHistory((prev) => [normalizeTransaction(transaction), ...prev])
  }

  const clearWallet = () => {
    setWallet(EMPTY_WALLET)
    setTransactionHistory([])
  }

  const refreshWallet = async (userId = user?.id) => {
    if (!userId) {
      clearWallet()
      return { success: false, message: 'User ID is required' }
    }

    const result = await WalletService.getWallet(userId)

    if (result.success) {
      setWallet(normalizeWallet(result.wallet, userId))
    }

    return result
  }

  const refreshTransactionHistory = async (userId = user?.id, limit = 50, offset = 0) => {
    if (!userId) {
      setTransactionHistory([])
      return { success: false, message: 'User ID is required' }
    }

    const result = await TransactionService.getTransactionHistory(userId, limit, offset)

    if (result.success) {
      setTransactionHistory((result.transactions || []).map(normalizeTransaction))
    }

    return result
  }

  const initializeWallet = async (userId = user?.id, initialBalance = null) => {
    if (!userId) {
      clearWallet()
      return { success: false, message: 'User ID is required' }
    }

    setWalletLoading(true)

    try {
      let walletResult = await WalletService.getWallet(userId)

      if (!walletResult.success) {
        walletResult = await WalletService.initializeWallet(
          userId,
          user?.created_by || user?.user_name || 'System',
          initialBalance || DEFAULT_FIAT_BALANCE
        )
      }

      if (!walletResult.success) {
        return walletResult
      }

      setWallet(normalizeWallet(walletResult.wallet, userId))
      await refreshTransactionHistory(userId)

      return { success: true, wallet: walletResult.wallet }
    } catch (error) {
      console.error('Error initializing wallet:', error)
      return { success: false, message: 'Failed to initialize wallet' }
    } finally {
      setWalletLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (isAuthenticated && user?.id) {
      initializeWallet(user.id)
      return
    }

    clearWallet()
  }, [authLoading, isAuthenticated, user?.id])

  const getBalance = (currencyCode = 'USD') => wallet.fiatBalance[currencyCode] || 0

  const getCryptoHolding = (coinSymbol) => wallet.cryptoHoldings[coinSymbol.toLowerCase()] || 0

  const updateFiatBalance = async (currencyCode, amount, operation) => {
    if (!wallet.userId) {
      return false
    }

    const result = await WalletService.updateFiatBalance(wallet.userId, currencyCode, amount, operation)

    if (!result.success) {
      console.error(`Failed to ${operation} fiat balance:`, result.message)
      return false
    }

    setWallet((prev) => ({
      ...prev,
      fiatBalance: result.wallet?.fiat_balance || prev.fiatBalance,
      lastUpdated: result.wallet?.last_updated || new Date().toISOString(),
    }))

    return true
  }

  const updateCryptoHolding = async (coinSymbol, quantity, operation) => {
    if (!wallet.userId) {
      return false
    }

    const result = await WalletService.updateCryptoHolding(wallet.userId, coinSymbol, quantity, operation)

    if (!result.success) {
      console.error(`Failed to ${operation} crypto holding:`, result.message)
      return false
    }

    setWallet((prev) => ({
      ...prev,
      cryptoHoldings: result.wallet?.crypto_holdings || prev.cryptoHoldings,
      lastUpdated: result.wallet?.last_updated || new Date().toISOString(),
    }))

    return true
  }

  const deductFiatBalance = async (currencyCode, amount) => updateFiatBalance(currencyCode, amount, 'deduct')

  const addFiatBalance = async (currencyCode, amount) => updateFiatBalance(currencyCode, amount, 'add')

  const addCryptoHolding = async (coinSymbol, quantity) => updateCryptoHolding(coinSymbol, quantity, 'add')

  const removeCryptoHolding = async (coinSymbol, quantity) => updateCryptoHolding(coinSymbol, quantity, 'remove')

  const buyCoins = async (transactionData) => {
    const result = await TransactionService.buyCoins(transactionData)

    if (!result.success) {
      return result
    }

    if (result.updatedWallet) {
      updateWallet(result.updatedWallet)
    } else {
      await refreshWallet(transactionData?.userId)
    }

    if (result.transaction) {
      addTransaction(result.transaction)
    }

    return result
  }

  const sellCoins = async (transactionData) => {
    const result = await TransactionService.sellCoins(transactionData)

    if (!result.success) {
      return result
    }

    if (result.updatedWallet) {
      updateWallet(result.updatedWallet)
    } else {
      await refreshWallet(transactionData?.userId)
    }

    if (result.transaction) {
      addTransaction(result.transaction)
    }

    return result
  }

  const contextValue = {
    wallet,
    transactionHistory,
    walletLoading,
    initializeWallet,
    refreshWallet,
    refreshTransactionHistory,
    clearWallet,
    getBalance,
    getCryptoHolding,
    deductFiatBalance,
    addFiatBalance,
    addCryptoHolding,
    removeCryptoHolding,
    updateWallet,
    addTransaction,
    buyCoins,
    sellCoins,
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {props.children}
    </WalletContext.Provider>
  )
}

export default WalletContextProvider
