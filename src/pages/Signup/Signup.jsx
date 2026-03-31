import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Signup.css'
import { AuthContext } from '../../context/AuthContext'

const Signup = () => {
  const navigate = useNavigate()
  const { signup } = useContext(AuthContext)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      // Call signup function from context
      const result = await signup(formData.name, formData.email, formData.password)
      
      if (result.success) {
        setSuccessMessage('Account created successfully! Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setErrors({ submit: result.message || 'Signup failed' })
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='signup-container'>
      <div className='signup-wrapper'>
        <div className='signup-card'>
          <div className='signup-header'>
            <h1>Create Account</h1>
            <p>Join CryptoPlace and start investing</p>
          </div>

          <form onSubmit={handleSubmit} className='signup-form'>
            {/* Name Field */}
            <div className='form-group'>
              <label htmlFor='name'>Full Name</label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Enter your full name'
                className={`form-input ${errors.name ? 'error' : ''}`}
              />
              {errors.name && <span className='error-message'>{errors.name}</span>}
            </div>

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
                placeholder='Create a strong password'
                className={`form-input ${errors.password ? 'error' : ''}`}
              />
              {errors.password && <span className='error-message'>{errors.password}</span>}
              <span className='password-hint'>At least 6 characters with 1 uppercase letter</span>
            </div>

            {/* Confirm Password Field */}
            <div className='form-group'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='Re-enter your password'
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              />
              {errors.confirmPassword && <span className='error-message'>{errors.confirmPassword}</span>}
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
              className='signup-btn'
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Login Link */}
          <div className='signup-footer'>
            <p>Already have an account? <Link to='/login' className='link'>Login</Link></p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className='signup-decoration'>
          <div className='decoration-circle decoration-circle-1'></div>
          <div className='decoration-circle decoration-circle-2'></div>
          <div className='decoration-circle decoration-circle-3'></div>
        </div>
      </div>
    </div>
  )
}

export default Signup
