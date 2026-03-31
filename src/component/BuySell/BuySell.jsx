import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './BuySell.css'
import { CoinContext } from '../../context/CoinContext'
import { AuthContext } from '../../context/AuthContext'

const BuySell = ({ coinData }) => {
  const { currency } = useContext(CoinContext)
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState('')
  const [isBuy, setIsBuy] = useState(true)

  const currentPrice = coinData?.market_data?.current_price[currency.name] || 0
  const totalValue = (quantity * currentPrice).toLocaleString()

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // Handle buy transaction logic here
    alert(`Buying ${quantity} ${coinData?.symbol?.toUpperCase()} at ${currency.symbol}${currentPrice}`)
  }

  const handleSellClick = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // Handle sell transaction logic here
    alert(`Selling ${quantity} ${coinData?.symbol?.toUpperCase()} at ${currency.symbol}${currentPrice}`)
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
        {/* Toggle Checkboxes */}
        <div className="toggle-group">
          <label className="checkbox-wrapper">
            <input 
              type="checkbox" 
              checked={isBuy}
              onChange={() => setIsBuy(true)}
              className="checkbox-input"
            />
            <span className={`checkbox-label ${isBuy ? 'active' : ''}`}>
              Buy
            </span>
          </label>
          
          <label className="checkbox-wrapper">
            <input 
              type="checkbox" 
              checked={!isBuy}
              onChange={() => setIsBuy(false)}
              className="checkbox-input"
            />
            <span className={`checkbox-label ${!isBuy ? 'active' : ''}`}>
              Sell
            </span>
          </label>
        </div>

        {isBuy ? (
          <>
            <div className="input-group-side">
              <label>Amount ({currency.symbol})</label>
              <input 
                type="number" 
                placeholder="Enter amount" 
                className="input-field-side"
              />
            </div>

            <div className="input-group-side">
              <label>Quantity ({coinData?.symbol?.toUpperCase()})</label>
              <input 
                type="number" 
                placeholder="Quantity" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input-field-side"
              />
            </div>

            {quantity && (
              <div className="total-info-side">
                <span>Total:</span>
                <span className="price">{currency.symbol}{totalValue}</span>
              </div>
            )}

            <button className="btn-side btn-buy-side" onClick={handleBuyClick}>
              Buy Now
            </button>
          </>
        ) : (
          <>
            <div className="input-group-side">
              <label>Quantity to Sell ({coinData?.symbol?.toUpperCase()})</label>
              <input 
                type="number" 
                placeholder="Quantity" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input-field-side"
              />
            </div>

            <div className="input-group-side">
              <label>Receive ({currency.symbol})</label>
              <input 
                type="text" 
                placeholder="Amount" 
                value={quantity ? totalValue : ''}
                readOnly
                className="input-field-side"
              />
            </div>

            {quantity && (
              <div className="total-info-side">
                <span>Total:</span>
                <span className="price">{currency.symbol}{totalValue}</span>
              </div>
            )}

            <button className="btn-side btn-sell-side" onClick={handleSellClick}>
              Sell Now
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default BuySell
