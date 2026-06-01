import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './BuySell.css'
import { CoinContext } from '../../context/CoinContext'
import { AuthContext } from '../../context/AuthContext'
import { WalletContext } from '../../context/WalletContext'
import { MetaMaskContext } from '../../context/MetaMaskContext'
const user = JSON.parse(localStorage.getItem("authUser"));
const BuySell = ({ coinData }) => {
  const { currency } = useContext(CoinContext)
  const { isAuthenticated, user } = useContext(AuthContext)

  const {
    wallet,
    buyCoins,
    sellCoins,
   
  } = useContext(WalletContext)
  const { useEthers, connectWallet, isConnected } = useContext(MetaMaskContext)
  const navigate = useNavigate()

  const [usdAmount, setUsdAmount] = useState(10)
  const [isBuy, setIsBuy] = useState(true)
  const [loading, setLoading] = useState(false)

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: ''
  })

  const currentPrice =
    coinData?.market_data?.current_price[currency.name] || 0

  const cryptoQuantity = usdAmount / currentPrice
  const walletAddress = user?.wallet_address || null
  const coinSymbol = coinData?.symbol?.toLowerCase() || ''

  // Fee calculation
  const fee = isBuy ? usdAmount * 0.02 : usdAmount * 0.01

  const displayTotal = isBuy
    ? usdAmount + fee
    : usdAmount - fee

  // Wallet balances
  const currentFiatBalance =
    wallet?.fiatBalance?.[currency.name.toUpperCase()] || 0

  const currentCryptoHolding =
    wallet?.cryptoHoldings?.[coinSymbol] || 0

  // Remaining balances
  const remainingFiatAfterTransaction = isBuy
    ? currentFiatBalance - displayTotal
    : currentFiatBalance + displayTotal

  const remainingCryptoAfterTransaction = isBuy
    ? currentCryptoHolding + cryptoQuantity
    : currentCryptoHolding - cryptoQuantity


    
  // Validation
  const canAfford = isBuy
    ? currentFiatBalance >= displayTotal
    : currentCryptoHolding >= cryptoQuantity

  const isDisabled =
    !canAfford || loading || usdAmount <= 0

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({
      show: true,
      message,
      type
    })

    setTimeout(() => {
      setToast({
        show: false,
        message: '',
        type: ''
      })
    }, 3000)
  }

  // Preset amount buttons
  const handlePresetClick = (amount) => {
    setUsdAmount(amount)
  }

  // BUY
  const handleBuyClick = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // Require MetaMask in ethers mode
    if (useEthers && !isConnected) {
      showToast('Please connect MetaMask first', 'error')
      return
    }

    setLoading(true)

    try {
      const result = await buyCoins({
        userId: user?.id,
        coinSymbol,
        usdAmount,
        coinQuantity: cryptoQuantity,
        currency: currency.name.toUpperCase(),
        currentPrice,
        walletAddress
      })

      if (result.success) {
        showToast(
          `Bought ${cryptoQuantity.toFixed(8)} ${coinData?.symbol?.toUpperCase()}`,
          'success'
        )

        setUsdAmount(10)
      } else {
        showToast(
          result.message || 'Transaction failed',
          'error'
        )
      }
    } catch (err) {
      console.error('Buy transaction error:', err)

      showToast(
        'An error occurred. Please try again.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  // SELL
  const handleSellClick = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // Require MetaMask in ethers mode
    if (useEthers && !isConnected) {
      showToast('Please connect MetaMask first', 'error')
      return
    }

    setLoading(true)

    try {
      const result = await sellCoins({
        userId: user?.id,
        coinSymbol,
        usdAmount,
        coinQuantity: cryptoQuantity,
        currency: currency.name.toUpperCase(),
        currentPrice,
        walletAddress
      })

      if (result.success) {
        showToast(
          `Sold ${cryptoQuantity.toFixed(8)} ${coinData?.symbol?.toUpperCase()}`,
          'success'
        )

        setUsdAmount(10)
      } else {
        showToast(
          result.message || 'Transaction failed',
          'error'
        )
      }
    } catch (err) {
      console.error('Sell transaction error:', err)

      showToast(
        'An error occurred. Please try again.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toast */}
      {toast.show && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor:
              toast.type === 'success'
                ? '#d4edda'
                : '#f8d7da',
            color:
              toast.type === 'success'
                ? '#155724'
                : '#721c24',
            padding: '12px 16px',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            maxWidth: '400px',
            wordWrap: 'break-word',
            fontSize: '14px'
          }}
        >
          {toast.message}
        </div>
      )}

      <div className="buy-sell-card-side">
        {/* Header */}
        <div className="card-header-side">
          <h3>
            Invest in {coinData?.symbol?.toUpperCase()}
          </h3>

          <p className="price-info-side">
            {currency.symbol}
            {currentPrice.toLocaleString()}
          </p>
        </div>

        <div className="card-content-side">

          {/* Buy/Sell Tabs */}
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

          {/* Input */}
          <div className="input-group-side">
            <label>
              Amount ({currency.symbol})
            </label>

            <div className="input-wrapper">
              <input
                type="number"
                value={usdAmount}
                onChange={(e) =>
                  setUsdAmount(
                    parseFloat(e.target.value) || 10
                  )
                }
                className="input-field-side"
                disabled={loading}
              />

              <select className="currency-dropdown">
                <option>{currency.symbol}</option>
              </select>
            </div>
          </div>

          {/* Conversion */}
          <div className="conversion-display">
            <span className="approx">≈</span>

            <span className="crypto-amount">
              {cryptoQuantity.toFixed(10)}
            </span>

            <span className="crypto-symbol">
              {coinData?.symbol?.toUpperCase()}
            </span>
          </div>

          {/* Fee */}
          <div
            className="fee-display"
            style={{
              fontSize: '0.85rem',
              color: '#666',
              marginTop: '8px'
            }}
          >
            <span>
              Fee ({isBuy ? '2%' : '1%'}):{' '}
              {currency.symbol}
              {fee.toFixed(2)}
            </span>

            <br />

            <span style={{ fontWeight: 'bold' }}>
              Total: {currency.symbol}
              {displayTotal.toFixed(2)}
            </span>
          </div>

          {/* Wallet Info */}
          <div
            style={{
              padding: '8px',
              margin: '8px 0',
              backgroundColor: '#273345',
              borderRadius: '4px',
              fontSize: '0.8rem',
              lineHeight: '1.3'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontWeight: '500' }}>
                Balance:
              </span>

              <span
                style={{
                  fontWeight: 'bold',
                  color: '#0066cc'
                }}
              >
                {isBuy
                  ? `${currency.symbol}${currentFiatBalance.toFixed(2)}`
                  : `${currentCryptoHolding.toFixed(8)} ${coinData?.symbol?.toUpperCase()}`}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontWeight: '500' }}>
                Cost:
              </span>

              <span
                style={{
                  fontWeight: 'bold',
                  color: '#d9534f'
                }}
              >
                {isBuy
                  ? `${currency.symbol}${displayTotal.toFixed(2)}`
                  : `${cryptoQuantity.toFixed(8)}`}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '4px',
                borderTop: '1px solid #555'
              }}
            >
              <span style={{ fontWeight: '600' }}>
                Remaining:
              </span>

              <span
                style={{
                  fontWeight: 'bold',
                  color:
                    remainingFiatAfterTransaction < 0 ||
                    remainingCryptoAfterTransaction < 0
                      ? '#d9534f'
                      : '#5cb85c'
                }}
              >
                {isBuy
                  ? `${currency.symbol}${remainingFiatAfterTransaction.toFixed(2)}`
                  : `${remainingCryptoAfterTransaction.toFixed(8)}`}
              </span>
            </div>

            {!canAfford && (
              <div
                style={{
                  marginTop: '4px',
                  color: '#d9534f',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}
              >
                ⚠ Insufficient{' '}
                {isBuy ? 'balance' : 'holdings'}
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

          {/* MetaMask Button */}
          
            <button
              className="btn-side"
              onClick={connectWallet}
              style={{
                marginBottom: '10px',
                backgroundColor: isConnected || isAuthenticated
                  ? '#28a745'
                  : '#f6851b',
                color: '#fff'
              }}     
              >
              {isConnected || isAuthenticated
                ? `Connected: ${user.wallet_address == null ? 'Dissconnect the meta mask to the other account or login again' : user.wallet_address?.slice(0, 6)}...${user.wallet_address == null ? '' :user.wallet_address?.slice(-4)}`
                : 'Connect MetaMask'}
            </button>
          

          {/* Buy/Sell Button */}
          <button
            className={`btn-side ${
              isBuy
                ? 'btn-buy-side'
                : 'btn-sell-side'
            }`}
            onClick={
              isBuy
                ? handleBuyClick
                : handleSellClick
            }
            disabled={isDisabled}
            style={{
              opacity: isDisabled ? 0.5 : 1,
              cursor: isDisabled
                ? 'not-allowed'
                : 'pointer',
              pointerEvents: isDisabled
                ? 'none'
                : 'auto'
            }}
          >
            {loading
              ? 'Processing...'
              : isDisabled && !loading
              ? isBuy
                ? 'Insufficient Balance'
                : 'Insufficient Holdings'
              : isBuy
              ? 'Buy Now'
              : 'Sell Now'}
          </button>
        </div>
      </div>
    </>
  )
}

export default BuySell