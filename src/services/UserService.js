// UserService.js - API service for user authentication
// Supports both database mode (USE_ETHERS=false) and blockchain mode (USE_ETHERS=true)

import { getApiBaseUrl, isDatabaseMode } from '../config/blockchain.js';

const API_BASE_URL = getApiBaseUrl();

// Log mode on first import (development only)
if (import.meta.env.VITE_APP_MODE === 'development') {
  console.log(`👤 UserService initialized in ${isDatabaseMode() ? 'database' : 'blockchain'} mode`);
}

class UserService {
  /**
   * Sign up a new user
   * @param {string} user_name - Username
   * @param {string} password - User's password
   * @param {string} created_by - User's full name
   * @returns {Promise<Object>} Response from server
   */
  async signup(user_name, password, created_by) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: user_name,
          password: password,
          created_by: created_by
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Signup failed'
        };
      }

      return {
        success: true,
        message: data.message || 'Account created successfully!',
        user: {
          id: data.id,
          user_name: user_name,
          created_by: created_by
        }
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Login user
   * @param {string} user_name - Username
   * @param {string} password - User's password
   * @returns {Promise<Object>} Response from server
   */
  async login(user_name, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: user_name,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Login failed'
        };
      }

      return {
        success: true,
        message: data.message || 'Login successful!',
        user: {
          id: data.user.id,
          user_name: data.user.user_name,
          wallet_address: data.user.wallet_address,
          created_by: data.user.created_by
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Logout user (client-side only)
   */
  logout() {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
  }

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser() {
    try {
      const user = localStorage.getItem('authUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error retrieving current user:', error);
      return null;
    }
  }
}

export default new UserService();
