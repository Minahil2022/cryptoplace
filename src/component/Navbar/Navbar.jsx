import React, { useContext, useState, useEffect, useRef } from 'react'
// User type import for JSDoc
import { /** @type {User} */ } from '../../models/UserModel'
import './Navbar.css'
import { CoinContext } from '../../context/CoinContext'
import { AuthContext } from '../../context/AuthContext'
import { WalletContext } from '../../context/WalletContext'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { setCurrency, currency } = useContext(CoinContext)
  /** @type {{ isAuthenticated: boolean, user: import('../../models/UserModel').User|null, logout: Function }} */
  const { isAuthenticated, user, logout } = useContext(AuthContext)
  const { wallet } = useContext(WalletContext)
  const navigate = useNavigate()
  const [showWalletDropdown, setShowWalletDropdown] = useState(false)
  const userBadgeRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userBadgeRef.current && !userBadgeRef.current.contains(event.target)) {
        setShowWalletDropdown(false)
      }
    }

    if (showWalletDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showWalletDropdown])

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd": {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
      case "eur": {
        setCurrency({ name: "eur", symbol: "€" });
        break;
      }
      case "inr": {
        setCurrency({ name: "inr", symbol: "₹" });
        break;
      }
      default: {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
    }
  }

  const handleWalletToggle = () => {
    setShowWalletDropdown(!showWalletDropdown)
  }

  const handleWalletClick = () => {
    navigate('/wallet')
    setShowWalletDropdown(false)
  }

  const handleLogout = () => {
    try {
      logout()
      navigate('/')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return (
    <div className='navbar'>
      <Link to={'/'}>
        <img/>
      </Link>
      <ul className={menuOpen ? "mobile-menu active" : "mobile-menu"}>
        <Link to={'/'}><li>Home</li></Link>
        <Link to={'/news'}><li>News</li></Link>
        <li>Features</li>
        <li>Pricing</li>
        <li>Blog</li>
      </ul>
      <button className="menu-btn"onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      <div className="nav-right">
        <select onChange={currencyHandler}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="inr">INR</option>
        </select>
        
        {isAuthenticated ? (
          <div className="auth-section">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
            <div 
              className="user-badge" 
              title={user.user_name || ''}
              onClick={handleWalletToggle}
              ref={userBadgeRef}
            >
              {user?.user_name?.charAt(0).toUpperCase() || ''}
              <span className="user-badge-tooltip">{user?.user_name}</span>
              
              {/* Wallet Dropdown */}
              {showWalletDropdown && (
                <div className="wallet-dropdown">
                  <div className="dropdown-header">
                    <span>Wallet</span>
                  </div>
                  
                  <div className="dropdown-content">
                    {/* Fiat Balance */}
                    <div className="dropdown-section">
                      <span className="section-label">Fiat Balance</span>
                      <div className="balance-item">
                        <span className="balance-currency">{currency.symbol}</span>
                        <span className="balance-value">
                          {(wallet.fiatBalance[currency.name.toUpperCase()] || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Crypto Holdings */}
                    <div className="dropdown-section">
                      <span className="section-label">Holdings</span>
                      {Object.keys(wallet.cryptoHoldings).length > 0 ? (
                        <div className="crypto-holdings">
                          {Object.entries(wallet.cryptoHoldings).slice(0, 3).map(([symbol, quantity]) => (
                            <div key={symbol} className="holding-item">
                              <span className="symbol">{symbol.toUpperCase()}</span>
                              <span className="quantity">{quantity.toFixed(4)}</span>
                            </div>
                          ))}
                          {Object.keys(wallet.cryptoHoldings).length > 3 && (
                            <div className="more-items">+{Object.keys(wallet.cryptoHoldings).length - 3} more</div>
                          )}
                        </div>
                      ) : (
                        <div className="no-holdings">No holdings</div>
                      )}
                    </div>

                    {/* View Full Wallet Button */}
                    <button 
                      className="view-wallet-btn"
                      onClick={handleWalletClick}
                    >
                      View Full Wallet →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <Link to='/login'>
              <button className="login-btn">Login</button>
            </Link>
            <Link to='/signup'>
              <button className="signup-btn">Sign Up </button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar
