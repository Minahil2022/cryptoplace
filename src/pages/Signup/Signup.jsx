import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Signup.css'
import { AuthContext } from '../../context/AuthContext'

const Signup = () => {
  const navigate = useNavigate()
  /** @type {(user_name: string, password: string, created_by: string) => Promise<{success: boolean, message: string}>} */
  const { signup } = useContext(AuthContext)
  
  const [formData, setFormData] = useState({
    created_by: '',
    user_name: '',
    password: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.created_by.trim()) {
      newErrors.created_by = 'Name is required'
    }
    
    if (!formData.user_name) {
      newErrors.user_name = 'Username is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
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
      const result = await signup(formData.user_name, formData.password, formData.created_by)
      
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
            {/* Name Field (created_by) */}
            <div className='form-group'>
              <label htmlFor='created_by'>Full Name</label>
              <input
                type='text'
                id='created_by'
                name='created_by'
                value={formData.created_by}
                onChange={handleChange}
                placeholder='Enter your full name'
                className={`form-input ${errors.created_by ? 'error' : ''}`}
              />
              {errors.created_by && <span className='error-message'>{errors.created_by}</span>}
            </div>

            {/* Username Field */}
            <div className='form-group'>
              <label htmlFor='user_name'>Username</label>
              <input
                type='text'
                id='user_name'
                name='user_name'
                value={formData.user_name}
                onChange={handleChange}
                placeholder='Choose a username'
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
                placeholder='Create a strong password'
                className={`form-input ${errors.password ? 'error' : ''}`}
              />
              {errors.password && <span className='error-message'>{errors.password}</span>}
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
