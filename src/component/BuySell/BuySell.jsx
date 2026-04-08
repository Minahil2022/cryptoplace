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
  const [toast, setToast] = useState({ show: false, message: '', type: '' })

  const currentPrice = coinData?.market_data?.current_price[currency.name] || 0
  const cryptoQuantity = usdAmount / currentPrice
  const coinSymbol = coinData?.symbol?.toLowerCase() || ''

  // Calculate fee and total
  const fee = isBuy ? usdAmount * 0.02 : usdAmount * 0.01
  const displayTotal = isBuy ? usdAmount + fee : usdAmount - fee

  // Get current balances
  const currentFiatBalance = wallet.fiatBalance[currency.name.toUpperCase()] || 0
  const currentCryptoHolding = wallet.cryptoHoldings[coinSymbol] || 0

  // Calculate remaining balances after transaction
  const remainingFiatAfterTransaction = isBuy ? currentFiatBalance - displayTotal : currentFiatBalance + displayTotal
  const remainingCryptoAfterTransaction = isBuy ? currentCryptoHolding + cryptoQuantity : currentCryptoHolding - cryptoQuantity

  // Check if transaction is allowed
  const canAfford = isBuy ? currentFiatBalance >= displayTotal : currentCryptoHolding >= cryptoQuantity
  const isDisabled = !canAfford || loading || usdAmount <= 0

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
  }

  const handlePresetClick = (amount) => {
    setUsdAmount(amount)
  }

  const handleBuyClick = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setLoading(true)

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

        showToast(`Bought ${cryptoQuantity.toFixed(8)} ${coinData?.symbol?.toUpperCase()}`, 'success')
        setUsdAmount(10)
      } else {
        // Revert optimistic update on failure
        addFiatBalance(currency.name.toUpperCase(), displayTotal)
        removeCryptoHolding(coinSymbol, cryptoQuantity)
        showToast(result.message || 'Transaction failed', 'error')
      }
    } catch (err) {
      console.error('Buy transaction error:', err)
      // Revert optimistic update
      addFiatBalance(currency.name.toUpperCase(), displayTotal)
      removeCryptoHolding(coinSymbol, cryptoQuantity)
      showToast('An error occurred. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSellClick = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setLoading(true)

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

        showToast(`Sold ${cryptoQuantity.toFixed(8)} ${coinData?.symbol?.toUpperCase()}`, 'success')
        setUsdAmount(10)
      } else {
        // Revert optimistic update on failure
        addCryptoHolding(coinSymbol, cryptoQuantity)
        deductFiatBalance(currency.name.toUpperCase(), displayTotal)
        showToast(result.message || 'Transaction failed', 'error')
      }
    } catch (err) {
      console.error('Sell transaction error:', err)
      // Revert optimistic update
      addCryptoHolding(coinSymbol, cryptoQuantity)
      deductFiatBalance(currency.name.toUpperCase(), displayTotal)
      showToast('An error occurred. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: toast.type === 'success' ? '#d4edda' : '#f8d7da',
          color: toast.type === 'success' ? '#155724' : '#721c24',
          padding: '12px 16px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
          maxWidth: '400px',
          wordWrap: 'break-word',
          fontSize: '14px'
        }}>
          {toast.message}
        </div>
      )}
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

        {/* Wallet Information */}
        <div style={{ 
          padding: '8px', 
          margin: '8px 0', 
          backgroundColor: '#273345', 
          borderRadius: '4px',
          fontSize: '0.8rem',
          lineHeight: '1.3'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Bal:</span>
            <span style={{ fontWeight: 'bold', color: '#0066cc' }}>
              {isBuy 
                ? `${currency.symbol}${currentFiatBalance.toFixed(2)}` 
                : `${currentCryptoHolding.toFixed(8)} ${coinData?.symbol?.toUpperCase()}`
              }
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Cost:</span>
            <span style={{ fontWeight: 'bold', color: '#d9534f' }}>
              {isBuy 
                ? `${currency.symbol}${displayTotal.toFixed(2)}` 
                : `${cryptoQuantity.toFixed(8)}`
              }
            </span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            paddingTop: '4px',
            borderTop: '1px solid #555'
          }}>
            <span style={{ fontWeight: '600' }}>Remain:</span>
            <span style={{ 
              fontWeight: 'bold', 
              color: remainingFiatAfterTransaction < 0 || remainingCryptoAfterTransaction < 0 ? '#d9534f' : '#5cb85c'
            }}>
              {isBuy 
                ? `${currency.symbol}${remainingFiatAfterTransaction.toFixed(2)}` 
                : `${remainingCryptoAfterTransaction.toFixed(8)}`
              }
            </span>
          </div>
          {!canAfford && (
            <div style={{ 
              marginTop: '4px', 
              color: '#d9534f', 
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              ⚠ Insufficient {isBuy ? 'bal' : 'holdings'}
            </div>
          )}
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

        {/* Transaction Button */}
        <button 
          className={`btn-side ${isBuy ? 'btn-buy-side' : 'btn-sell-side'}`}
          onClick={isBuy ? handleBuyClick : handleSellClick}
          disabled={isDisabled}
          style={{ 
            opacity: isDisabled ? 0.5 : 1, 
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            pointerEvents: isDisabled ? 'none' : 'auto'
          }}
        >
          {loading ? 'Processing...' : (isDisabled && !loading ? (isBuy ? 'Insufficient Balance' : 'Insufficient Holdings') : (isBuy ? 'Buy Now' : 'Sell Now'))}
        </button>
        </div>
      </div>
    </>
  )
}

export default BuySell
