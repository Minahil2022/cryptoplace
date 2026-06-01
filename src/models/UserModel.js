// UserModel.js
// This file defines the user interface for the frontend, matching the backend SQL schema.

/**
 * @typedef {Object} User
 * @property {number} id - User's unique ID
 * @property {string} user_name - Username (login/display)
 * @property {string} wallet_address - User's wallet address
 * @property {string} password - User's password (only for creation, not stored client-side after login)
 * @property {string} created_by - Full name of the user (display name)
 * @property {string} created_dt - Account creation date (ISO string)
 */

// Usage:
// import { /** @type {User} */ } from '../models/UserModel'
// /** @type {User} */
// const user = { id: 1, user_name: 'alice', wallet_address: '0x...', created_by: 'Alice', created_dt: '2024-01-01T00:00:00Z' }
