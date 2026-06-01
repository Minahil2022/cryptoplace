import { createContext, useState, useEffect } from 'react'
import UserService from '../services/UserService'
import WalletService from '../services/WalletService'
// User type import for JSDoc
import { /** @type {User} */ } from '../models/UserModel'

export const AuthContext = createContext()

const AuthContextProvider = (props) => {
  /** @type {[import('../models/UserModel').User|null, Function]} */
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Failed to retrieve stored user:', error)
      }
    }
    setLoading(false)
  }, [])

  // Login function - Calls backend API
  /**
   * @param {string} user_name
   * @param {string} password
   * @returns {Promise<{success: boolean, message: string}>}
   */
  const login = async (user_name, password) => {
    try {
      const result = await UserService.login(user_name, password)
      
      if (result.success) {
        setUser(result.user)
        setIsAuthenticated(true)
        localStorage.setItem('authUser', JSON.stringify(result.user))
        // Initialize wallet for logged in user
        // Try to fetch existing wallet first
        let walletResult = await WalletService.getWallet(result.user.id)
        
        // If wallet doesn't exist, create one
        if (!walletResult.success) {
          walletResult = await WalletService.initializeWallet(
            result.user.id,
            result.user.created_by,
            { USD: 10000.00, EUR: 8000.00 }
          )
        }
        
        // Note: WalletContext will be updated separately by useEffect
        return { success: true, message: result.message }
      } else {
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'An error occurred during login' }
    }
  }

  // Signup function - Calls backend API
  /**
   * @param {string} user_name
   * @param {string} password
   * @param {string} created_by
   * @returns {Promise<{success: boolean, message: string}>}
   */
  const signup = async (user_name, password, created_by) => {
    try {
      const result = await UserService.signup(user_name, password, created_by)
      
      if (result.success) {
        return { success: true, message: result.message }
      } else {
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, message: 'An error occurred during signup' }
    }
  }

  // Logout function
  const logout = () => {
    try {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('authUser')
      UserService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const contextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
