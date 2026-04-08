import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './BuySell.css'
import { CoinContext } from '../../context/CoinContext'
import { AuthContext } from '../../context/AuthContext'
import { WalletContext } from '../../context/WalletContext'
import TransactionService from '../../services/TransactionService'

const BuySell = ({ coinData }) => {
  const { currency } = useContext(CoinContext)
  const { isAuthenticated, user } = useContext(AuthContext)
  const { 
    wallet, 
    deductFiatBalance, 
    addFiatBalance, 
    addCryptoHolding, 
    removeCryptoHolding, 
    updateWallet,
    addTransaction 
  } = useContext(WalletContext)
  const navigate = useNavigate()
  const [usdAmount, setUsdAmount] = useState(10)
  const [isBuy, setIsBuy] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const currentPrice = coinData?.market_data?.current_price[currency.name] || 0
  const cryptoQuantity = usdAmount / currentPrice
  const coinSymbol = coinData?.symbol?.toLowerCase() || ''

  // Calculate fee and total
  const fee = isBuy ? usdAmount * 0.02 : usdAmount * 0.01
  const displayTotal = isBuy ? usdAmount + fee : usdAmount - fee

  const handlePresetClick = (amount) => {
    setUsdAmount(amount)
    setMessage('')
    setError('')
  }

  const handleBuyClick = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // Validate sufficient balance
    const currentBalance = wallet.fiatBalance[currency.name.toUpperCase()] || 0
    if (currentBalance < displayTotal) {
      setError(`Insufficient balance. You have ${currency.symbol}${currentBalance.toFixed(2)} but need ${currency.symbol}${displayTotal.toFixed(2)}`)
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Optimistic UI update
      deductFiatBalance(currency.name.toUpperCase(), displayTotal)
      addCryptoHolding(coinSymbol, cryptoQuantity)

      // Call backend API
      const result = await TransactionService.buyCoins({
        userId: user?.id,
        coinSymbol: coinSymbol,
        usdAmount: usdAmount,
        coinQuantity: cryptoQuantity,
        currency: currency.name.toUpperCase(),
        currentPrice: currentPrice
      })

      if (result.success) {
        // Add transaction to history
        addTransaction({
          type: 'buy',
          symbol: coinSymbol,
          quantity: cryptoQuantity,
          usdAmount: usdAmount,
          fee: fee,
          total: displayTotal,
          timestamp: new Date().toISOString(),
          status: 'completed'
        })

        setMessage(`Successfully bought ${cryptoQuantity.toFixed(8)} ${coinData?.symbol?.toUpperCase()} for ${currency.symbol}${displayTotal.toFixed(2)}`)
        setUsdAmount(10)
      } else {
        // Revert optimistic update on failure
        addFiatBalance(currency.name.toUpperCase(), displayTotal)
        removeCryptoHolding(coinSymbol, cryptoQuantity)
        setError(result.message || 'Transaction failed')
      }
    } catch (err) {
      console.error('Buy transaction error:', err)
      // Revert optimistic update
      addFiatBalance(currency.name.toUpperCase(), displayTotal)
      removeCryptoHolding(coinSymbol, cryptoQuantity)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSellClick = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // Validate sufficient holdings
    const currentHolding = wallet.cryptoHoldings[coinSymbol] || 0
    if (currentHolding < cryptoQuantity) {
      setError(`Insufficient ${coinSymbol.toUpperCase()} holdings. You have ${currentHolding.toFixed(8)} but trying to sell ${cryptoQuantity.toFixed(8)}`)
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Optimistic UI update
      removeCryptoHolding(coinSymbol, cryptoQuantity)
      addFiatBalance(currency.name.toUpperCase(), displayTotal)

      // Call backend API
      const result = await TransactionService.sellCoins({
        userId: user?.id,
        coinSymbol: coinSymbol,
        usdAmount: usdAmount,
        coinQuantity: cryptoQuantity,
        currency: currency.name.toUpperCase(),
        currentPrice: currentPrice
      })

      if (result.success) {
        // Add transaction to history
        addTransaction({
          type: 'sell',
          symbol: coinSymbol,
          quantity: cryptoQuantity,
          usdAmount: usdAmount,
          fee: fee,
          netProceeds: displayTotal,
          timestamp: new Date().toISOString(),
          status: 'completed'
        })

        setMessage(`Successfully sold ${cryptoQuantity.toFixed(8)} ${coinData?.symbol?.toUpperCase()} for ${currency.symbol}${displayTotal.toFixed(2)}`)
        setUsdAmount(10)
      } else {
        // Revert optimistic update on failure
        addCryptoHolding(coinSymbol, cryptoQuantity)
        deductFiatBalance(currency.name.toUpperCase(), displayTotal)
        setError(result.message || 'Transaction failed')
      }
    } catch (err) {
      console.error('Sell transaction error:', err)
      // Revert optimistic update
      addCryptoHolding(coinSymbol, cryptoQuantity)
      deductFiatBalance(currency.name.toUpperCase(), displayTotal)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="buy-sell-card-side">
      <div className="card-header-side">
        <h3>Invest in {coinData?.symbol?.toUpperCase()}</h3>
        <p className="price-info-side">
          {currency.symbol}{currentPrice.toLocaleString()}
        </p>
      </div>

      <div className="card-content-side">
        {/* Toggle Tabs */}
        <div className="toggle-tabs">
          <button 
            className={`tab-btn ${isBuy ? 'active' : ''}`}
            onClick={() => setIsBuy(true)}
          >
            Buy
          </button>
          <button 
            className={`tab-btn ${!isBuy ? 'active' : ''}`}
            onClick={() => setIsBuy(false)}
          >
            Sell
          </button>
        </div>

        {/* Single Input Field */}
        <div className="input-group-side">
          <label>Amount ({currency.symbol})</label>
          <div className="input-wrapper">
            <input 
              type="number" 
              value={usdAmount}
              onChange={(e) => setUsdAmount(parseFloat(e.target.value) || 10)}
              className="input-field-side"
              disabled={loading}
            />
            <select className="currency-dropdown">
              <option>{currency.symbol}</option>
            </select>
          </div>
        </div>

        {/* Conversion Display */}
        <div className="conversion-display">
          <span className="approx">≈</span>
          <span className="crypto-amount">{cryptoQuantity.toFixed(10)}</span>
          <span className="crypto-symbol">{coinData?.symbol?.toUpperCase()}</span>
        </div>

        {/* Fee Display */}
        <div className="fee-display" style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px' }}>
          <span>Fee ({isBuy ? '2%' : '1%'}): {currency.symbol}{fee.toFixed(2)}</span>
          <br/>
          <span style={{ fontWeight: 'bold' }}>Total: {currency.symbol}{displayTotal.toFixed(2)}</span>
        </div>

        {/* Preset Buttons */}
        <div className="preset-buttons">
          <button 
            className="preset-btn"
            onClick={() => handlePresetClick(50)}
            disabled={loading}
          >
            $50
          </button>
          <button 
            className="preset-btn"
            onClick={() => handlePresetClick(150)}
            disabled={loading}
          >
            $150
          </button>
          <button 
            className="preset-btn"
            onClick={() => handlePresetClick(500)}
            disabled={loading}
          >
            $500
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div style={{ 
            padding: '10px', 
            marginTop: '10px', 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            {message}
          </div>
        )}
        {error && (
          <div style={{ 
            padding: '10px', 
            marginTop: '10px', 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {/* Transaction Button */}
        <button 
          className={`btn-side ${isBuy ? 'btn-buy-side' : 'btn-sell-side'}`}
          onClick={isBuy ? handleBuyClick : handleSellClick}
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Processing...' : (isBuy ? 'Buy Now' : 'Sell Now')}
        </button>
      </div>
    </div>
  )
}

export default BuySell
