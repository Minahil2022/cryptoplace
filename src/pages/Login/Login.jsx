import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'
import { AuthContext } from '../../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  /** @type {(user_name: string, password: string) => Promise<{success: boolean, message: string}>} */
  const { login } = useContext(AuthContext)
  
  const [formData, setFormData] = useState({
    user_name: '',
    password: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.user_name) {
      newErrors.user_name = 'Username is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setSuccessMessage('')
    
    try {
      // Call login function from context
      const result = await login(formData.user_name, formData.password)
      
      if (result.success) {
        setSuccessMessage('Login successful! Redirecting...')
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } else {
        setErrors({ submit: result.message || 'Login failed' })
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-container'>
      <div className='login-wrapper'>
        <div className='login-card'>
          <div className='login-header'>
            <h1>Login</h1>
            <p>Welcome back to CryptoPlace</p>
          </div>

          <form onSubmit={handleSubmit} className='login-form'>
            {/* Username Field */}
            <div className='form-group'>
              <label htmlFor='user_name'>Username</label>
              <input
                type='text'
                id='user_name'
                name='user_name'
                value={formData.user_name}
                onChange={handleChange}
                placeholder='Enter your username'
                className={`form-input ${errors.user_name ? 'error' : ''}`}
              />
              {errors.user_name && <span className='error-message'>{errors.user_name}</span>}
            </div>

            {/* Password Field */}
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter your password'
                className={`form-input ${errors.password ? 'error' : ''}`}
              />
              {errors.password && <span className='error-message'>{errors.password}</span>}
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className='alert alert-error'>
                {errors.submit}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className='alert alert-success'>
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              className='login-btn'
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Signup Link */}
          <div className='login-footer'>
            <p>Don't have an account? <Link to='/signup' className='link'>Sign up</Link></p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className='login-decoration'>
          <div className='decoration-circle decoration-circle-1'></div>
          <div className='decoration-circle decoration-circle-2'></div>
          <div className='decoration-circle decoration-circle-3'></div>
        </div>
      </div>
    </div>
  )
}

export default Login
