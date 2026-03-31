import React, { useContext } from 'react'
import './Navbar.css'
import { CoinContext } from '../../context/CoinContext'
import { AuthContext } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {

  const { setCurrency } = useContext(CoinContext)
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
            <span className="user-name">{user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
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
