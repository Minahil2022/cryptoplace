/**
 * Blockchain Configuration Module
 * Centralized config for blockchain vs database mode toggle
 */

export const BLOCKCHAIN_CONFIG = {
  // Mode toggle: true = ethers.js/blockchain, false = database
  USE_ETHERS: import.meta.env.VITE_USE_ETHERS === 'true',

  // Blockchain settings (only used when USE_ETHERS=true)
  RPC_URL: import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/85557bf2c0284e4ab404da743eaaf676',
  CHAIN_ID: import.meta.env.VITE_CHAIN_ID || '11155111',
  NETWORK_NAME: import.meta.env.VITE_NETWORK_NAME || 'sepolia',

  // Backend API (used in both modes for metadata)
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',

  // App mode
  APP_MODE: import.meta.env.VITE_APP_MODE || 'development'
};

/**
 * Check if running in blockchain mode (ethers.js + MetaMask)
 * @returns {boolean} true if blockchain mode enabled
 */
export const isBlockchainMode = () => BLOCKCHAIN_CONFIG.USE_ETHERS;

/**
 * Check if running in database mode (backend wallet)
 * @returns {boolean} true if database mode enabled
 */
export const isDatabaseMode = () => !BLOCKCHAIN_CONFIG.USE_ETHERS;

/**
 * Get API base URL
 * @returns {string} API base URL
 */
export const getApiBaseUrl = () => BLOCKCHAIN_CONFIG.API_BASE_URL;

/**
 * Get current mode as string (for logging)
 * @returns {string} 'blockchain' or 'database'
 */
export const getCurrentMode = () => isBlockchainMode() ? 'blockchain' : 'database';

// Log current configuration on module load
if (BLOCKCHAIN_CONFIG.APP_MODE === 'development') {
  console.log(`🔗 CryptoPlace initialized in ${getCurrentMode()} mode`);
  console.log(`   USE_ETHERS: ${BLOCKCHAIN_CONFIG.USE_ETHERS}`);
  console.log(`   API URL: ${BLOCKCHAIN_CONFIG.API_BASE_URL}`);
  if (isBlockchainMode()) {
    console.log(`   Network: ${BLOCKCHAIN_CONFIG.NETWORK_NAME} (Chain ID: ${BLOCKCHAIN_CONFIG.CHAIN_ID})`);
  }
}

export default BLOCKCHAIN_CONFIG;
