// TransactionService.js - API service for crypto transactions (buy/sell)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class TransactionService {
  /**
   * Get transaction history for a user
   * @param {number} userId
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<Object>}
   */
  async getTransactionHistory(userId, limit = 50, offset = 0) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${userId}?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to retrieve transaction history'
        }
      }

      return {
        success: true,
        message: data.message || 'Transaction history retrieved successfully',
        transactions: data.data || [],
        count: data.count || 0
      }
    } catch (error) {
      console.error('Transaction history error:', error)
      return {
        success: false,
        message: 'Network error. Please try again.'
      }
    }
  }

  /**
   * Buy crypto coins
   * @param {object} transactionData
   * @param {number} transactionData.userId - User ID
   * @param {string} transactionData.coinSymbol - Coin symbol (e.g., 'btc', 'eth')
   * @param {number} transactionData.usdAmount - Amount in USD
   * @param {number} transactionData.coinQuantity - Quantity of coins
   * @param {string} transactionData.currency - Currency symbol (e.g., 'USD')
   * @param {number} transactionData.currentPrice - Current price at time of purchase
   * @returns {Promise<Object>} Response from server with updated wallet
   */
  async buyCoins(transactionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Buy transaction failed'
        };
      }

      return {
        success: true,
        message: data.message || 'Purchase successful!',
        transaction: data.transaction,
        updatedWallet: data.updatedWallet
      };
    } catch (error) {
      console.error('Buy transaction error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Sell crypto coins
   * @param {object} transactionData
   * @param {number} transactionData.userId - User ID
   * @param {string} transactionData.coinSymbol - Coin symbol (e.g., 'btc', 'eth')
   * @param {number} transactionData.usdAmount - Amount received in USD
   * @param {number} transactionData.coinQuantity - Quantity of coins
   * @param {string} transactionData.currency - Currency symbol (e.g., 'USD')
   * @param {number} transactionData.currentPrice - Current price at time of sale
   * @returns {Promise<Object>} Response from server with updated wallet
   */
  async sellCoins(transactionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/sell`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Sell transaction failed'
        };
      }

      return {
        success: true,
        message: data.message || 'Sale successful!',
        transaction: data.transaction,
        updatedWallet: data.updatedWallet
      };
    } catch (error) {
      console.error('Sell transaction error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }
}

export default new TransactionService();
