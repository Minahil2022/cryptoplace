import { createContext, useState, useEffect } from 'react'

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

  // Login function
  const login = async (email, password) => {
    try {
      // Simulate API call - Replace with actual API call
      // For now, we're just validating locally and storing in localStorage
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // Check if user exists in localStorage (simulated database)
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const foundUser = registeredUsers.find(u => u.email === email && u.password === password)

      if (foundUser) {
        const userData = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email
        }
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem('authUser', JSON.stringify(userData))
        return { success: true, message: 'Login successful!' }
      } else {
        return { success: false, message: 'Invalid email or password' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'An error occurred during login' }
    }
  }

  // Signup function
  const signup = async (name, email, password) => {
    try {
      // Simulate API call - Replace with actual API call
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check if user already exists
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const userExists = registeredUsers.some(u => u.email === email)

      if (userExists) {
        return { success: false, message: 'Email already registered' }
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password // In production, this should be hashed on the server
      }

      // Store user in localStorage (simulated database)
      registeredUsers.push(newUser)
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))

      return { success: true, message: 'Account created successfully!' }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, message: 'An error occurred during signup' }
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('authUser')
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
