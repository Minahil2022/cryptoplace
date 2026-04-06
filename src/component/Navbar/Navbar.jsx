import React, { useContext } from 'react'
// User type import for JSDoc
import { /** @type {User} */ } from '../../models/UserModel'
import './Navbar.css'
import { CoinContext } from '../../context/CoinContext'
import { AuthContext } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {

  const { setCurrency } = useContext(CoinContext)
  /** @type {{ isAuthenticated: boolean, user: import('../../models/UserModel').User|null, logout: Function }} */
  const { isAuthenticated, user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

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

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className='navbar'>
      <Link to={'/'}>
        <img src="" alt="" />
      </Link>
      <ul>
        <Link to={'/'}><li>Home</li></Link>
        <Link to={'/news'}><li>News</li></Link>
        <li>Features</li>
        <li>Pricing</li>
        <li>Blog</li>
      </ul>
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
            <div className="user-badge" title={user.user_name || ''}>
              {user?.user_name?.charAt(0).toUpperCase() || ''}
              <span className="user-badge-tooltip">{user?.user_name}</span>
            </div>
          </div>
        ) : (
          <>
            <Link to='/login'>
              <button className="login-btn">Login</button>
            </Link>
            <Link to='/signup'>
              <button className="signup-btn">Sign Up <img src="" alt="" /></button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar
