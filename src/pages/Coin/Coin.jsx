import React, { useContext, useEffect, useState } from 'react'
import './Coin.css'
import { useParams, useNavigate } from 'react-router-dom'
import { CoinContext } from '../../context/CoinContext'
import { AuthContext } from '../../context/AuthContext'
import LineChart from '../../component/LineChart/LineChart'
import BuySell from '../../component/BuySell/BuySell'

const Coin = () => {

  const { coinId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(AuthContext)

  const [coinData, setCoinData] = useState(null)
  const [historicalData, setHistoricalData] = useState(null)

  const { currency } = useContext(CoinContext)

  const fetchCoinData = async () => {
    const options = {
      method: 'GET',
      headers: { 'x-cg-demo-api-key': 'CG-E56519TQCeFvpCPQXQZcqFe2' }
    }

    fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options)
      .then(res => res.json())
      .then(res => setCoinData(res))
      .catch(err => console.error(err))
  }

  const fetchHistoricalData = async () => {
    const options = {
      method: 'GET',
      headers: { 'x-cg-demo-api-key': 'CG-E56519TQCeFvpCPQXQZcqFe2' }
    }

    fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`, options)
      .then(res => res.json())
      .then(res => setHistoricalData(res))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchCoinData()
    fetchHistoricalData()
  }, [currency, coinId])

  if (coinData && historicalData) {
    return (
      <div className='coin'>
        <div className='coin-name'>
          <img src={coinData?.image?.large} alt="" />
          <p>
            <b>
              {coinData.name} ({coinData.symbol?.toUpperCase()})
            </b>
          </p>
        </div>

        <div className="coin-chart">
          <LineChart historicalData={historicalData} />
        </div>

        <div className="coin-details-wrapper">
          <div className="coin-info">
            <ul>
              <li>Crypto Market Rank</li>
              <li>{coinData.market_cap_rank}</li>
            </ul>
            <ul>
              <li>Current Price</li>
              <li>{currency.symbol} {coinData.market_data.current_price[currency.name].toLocaleString()}</li>
            </ul>
            <ul>
              <li>Market Cap</li>
              <li>{currency.symbol} {coinData.market_data.market_cap[currency.name].toLocaleString()}</li>
            </ul>
            <ul>
              <li>24 Hour high</li>
              <li>{currency.symbol} {coinData.market_data.high_24h[currency.name].toLocaleString()}</li>
            </ul>
            <ul>
              <li>24 Hour low</li>
              <li>{currency.symbol} {coinData.market_data.low_24h[currency.name].toLocaleString()}</li>
            </ul>
          </div>

          {isAuthenticated ? (
            <BuySell coinData={coinData} />
          ) : (
            <div className="login-required-card">
              <div className="login-required-icon">🔒</div>
              <h3>Login Required</h3>
              <p>You need to be logged in to buy or sell coins</p>
              <button onClick={() => navigate('/login')} className="btn-login-redirect">
                Go to Login
              </button>
              <button onClick={() => navigate('/signup')} className="btn-signup-redirect">
                Create Account
              </button>
            </div>
          )}
        </div>

      </div>
    )
  } else {
    return (
      <div className='spinner'>
        <div className="spin"></div>
      </div>
    )
  }
}

export default Coin