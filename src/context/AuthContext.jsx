import { createContext, useState, useEffect } from 'react'
import UserService from '../services/UserService'

export const AuthContext = createContext()

const AuthContextProvider = (props) => {
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
  const login = async (email, password) => {
    try {
      const result = await UserService.login(email, password)
      
      if (result.success) {
        setUser(result.user)
        setIsAuthenticated(true)
        localStorage.setItem('authUser', JSON.stringify(result.user))
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
  const signup = async (name, email, password) => {
    try {
      const result = await UserService.signup(name, email, password)
      
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
    setUser(null)
    setIsAuthenticated(false)
    UserService.logout()
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
