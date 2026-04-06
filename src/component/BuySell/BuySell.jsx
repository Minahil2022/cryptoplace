import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './BuySell.css'
import { CoinContext } from '../../context/CoinContext'
import { AuthContext } from '../../context/AuthContext'

const BuySell = ({ coinData }) => {
  const { currency } = useContext(CoinContext)
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const [usdAmount, setUsdAmount] = useState(10)
  const [isBuy, setIsBuy] = useState(true)

  const currentPrice = coinData?.market_data?.current_price[currency.name] || 0
  const cryptoQuantity = usdAmount / currentPrice

  const handlePresetClick = (amount) => {
    setUsdAmount(amount)
  }

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // Handle buy transaction logic here
    alert(`Buying ${cryptoQuantity.toFixed(8)} ${coinData?.symbol?.toUpperCase()} for ${currency.symbol}${usdAmount}`)
  }

  const handleSellClick = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // Handle sell transaction logic here
    alert(`Selling ${cryptoQuantity.toFixed(8)} ${coinData?.symbol?.toUpperCase()} for ${currency.symbol}${usdAmount}`)
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

        {/* Preset Buttons */}
        <div className="preset-buttons">
          <button 
            className="preset-btn"
            onClick={() => handlePresetClick(50)}
          >
            $50
          </button>
          <button 
            className="preset-btn"
            onClick={() => handlePresetClick(150)}
          >
            $150
          </button>
          <button 
            className="preset-btn"
            onClick={() => handlePresetClick(500)}
          >
            $500
          </button>
        </div>

        {/* Transaction Button */}
        <button 
          className={`btn-side ${isBuy ? 'btn-buy-side' : 'btn-sell-side'}`}
          onClick={isBuy ? handleBuyClick : handleSellClick}
        >
          {isBuy ? 'Buy Now' : 'Sell Now'}
        </button>
      </div>
    </div>
  )
}

export default BuySell
