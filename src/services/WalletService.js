// WalletService.js - API service for wallet operations
// Supports both database mode (USE_ETHERS=false) and blockchain mode (USE_ETHERS=true)

import { getApiBaseUrl, isDatabaseMode } from '../config/blockchain.js';

// metamask integreation 
import { ethers } from "ethers";

export const connectMetaMask = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  // Request wallet connection
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { provider, signer, address };
};


const API_BASE_URL = getApiBaseUrl();

// Log mode on first import (development only)
if (import.meta.env.VITE_APP_MODE === 'development') {
  console.log(`📊 WalletService initialized in ${isDatabaseMode() ? 'database' : 'blockchain'} mode`);
}

class WalletService {
  /**
   * Initialize wallet for a user
   * @param {number} user_id - User ID
   * @param {object} initial_balance - Optional initial balance object
   * @param {string} created_by - User's name
   * @returns {Promise<Object>} Response from server
   */
  async initializeWallet(user_id, created_by, initial_balance = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
          created_by: created_by,
          initial_balance: initial_balance
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to initialize wallet'
        };
      }

      return {
        success: true,
        message: data.message || 'Wallet initialized successfully',
        wallet: data.wallet
      };
    } catch (error) {
      console.error('Initialize wallet error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Get wallet for a user
   * @param {number} user_id - User ID
   * @returns {Promise<Object>} Response from server
   */
  async getWallet(user_id) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets/${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to retrieve wallet'
        };
      }

      return {
        success: true,
        message: data.message || 'Wallet retrieved successfully',
        wallet: data.data
      };
    } catch (error) {
      console.error('Get wallet error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Update fiat balance
   * @param {number} user_id - User ID
   * @param {string} currency_code - Currency code (e.g., 'USD', 'EUR')
   * @param {number} amount - Amount to add or deduct
   * @param {string} operation - 'add' or 'deduct'
   * @returns {Promise<Object>} Response from server
   */
  async updateFiatBalance(user_id, currency_code, amount, operation = 'add') {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets/${user_id}/fiat`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency_code: currency_code,
          amount: amount,
          operation: operation
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to update fiat balance'
        };
      }

      return {
        success: true,
        message: data.message || 'Fiat balance updated successfully',
        wallet: data.data
      };
    } catch (error) {
      console.error('Update fiat balance error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Update crypto holding
   * @param {number} user_id - User ID
   * @param {string} coin_symbol - Coin symbol (e.g., 'btc', 'eth')
   * @param {number} quantity - Quantity to add or remove
   * @param {string} operation - 'add' or 'remove'
   * @returns {Promise<Object>} Response from server
   */
  async updateCryptoHolding(user_id, coin_symbol, quantity, operation = 'add') {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets/${user_id}/crypto`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coin_symbol: coin_symbol,
          quantity: quantity,
          operation: operation
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to update crypto holding'
        };
      }

      return {
        success: true,
        message: data.message || 'Crypto holding updated successfully',
        wallet: data.data
      };
    } catch (error) {
      console.error('Update crypto holding error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Delete (soft delete) wallet
   * @param {number} user_id - User ID
   * @returns {Promise<Object>} Response from server
   */
  async deleteWallet(user_id) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets/${user_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to delete wallet'
        };
      }

      return {
        success: true,
        message: data.message || 'Wallet deleted successfully'
      };
    } catch (error) {
      console.error('Delete wallet error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Get transaction history for a user
   * @param {number} user_id - User ID
   * @param {number} limit - Number of transactions to fetch (default: 50)
   * @param {number} offset - Offset for pagination (default: 0)
   * @returns {Promise<Object>} Response from server
   */
  async getTransactionHistory(user_id, limit = 50, offset = 0) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${user_id}?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to retrieve transaction history'
        };
      }

      return {
        success: true,
        message: data.message || 'Transaction history retrieved successfully',
        transactions: data.data,
        count: data.count
      };
    } catch (error) {
      console.error('Get transaction history error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }
}

export default new WalletService();
