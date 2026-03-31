import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'
import { AuthContext } from '../../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
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
      const result = await login(formData.email, formData.password)
      
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
            {/* Email Field */}
            <div className='form-group'>
              <label htmlFor='email'>Email Address</label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Enter your email'
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className='error-message'>{errors.email}</span>}
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
