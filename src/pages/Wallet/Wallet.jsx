import React, { useState, useEffect, useContext } from 'react'
import './Wallet.css'
import { CoinContext } from '../../context/CoinContext'
import { AuthContext } from '../../context/AuthContext'
import { WalletContext } from '../../context/WalletContext'






const Wallet = () => {
  
  const { currency } = useContext(CoinContext)
  const { user } = useContext(AuthContext)
  const { wallet, transactionHistory } = useContext(WalletContext)
  const [blockchainTxs, setBlockchainTxs] = useState([])
  const [loadingBlockchainTxs, setLoadingBlockchainTxs] = useState(false)

  
  const fetchBlockchainTransactions = async () => {
  try {
    if (!user?.wallet_address) return

    setLoadingBlockchainTxs(true)

    const response = await fetch(
      `http://localhost:3000/api/wallets/${user.wallet_address}/blockchain-transactions`
    )

    const data = await response.json()

    if (data.success) {
      setBlockchainTxs(data.transactions || [])
    }
  } catch (error) {
    console.error(error)
  } finally {
    setLoadingBlockchainTxs(false)
  }
}
useEffect(() => {
    if (user?.wallet_address) {
      fetchBlockchainTransactions()
    }
  }, [user?.wallet_address])
  
  // Calculate total crypto value in current currency
  const calculateTotalCryptoValue = () => {
    // This would need coin prices - for now, display holdings
    return Object.keys(wallet.cryptoHoldings).length
  }

  const getTotalFiatBalance = () => {
    const balance = wallet.fiatBalance[currency.name.toUpperCase()] || 0
    return balance.toFixed(2)
  }

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <h1>My Wallet</h1>
        <p className="user-info">User: {user?.user_name || 'N/A'}</p>
      </div>

      <div className="wallet-content">
        {/* Fiat Balance Card */}
        <div className="balance-card fiat-card">
          <div className="card-header">
            <h2>Fiat Balance</h2>
            <span className="currency-badge">{currency.symbol}</span>
          </div>
          <div className="balance-display">
            <p className="balance-amount">
              {currency.symbol}{getTotalFiatBalance()}
            </p>
          </div>
          <div className="balance-details">
            {Object.entries(wallet.fiatBalance).map(([curr, amount]) => (
              <div key={curr} className="balance-row">
                <span>{curr}</span>
                <span className="amount">{currency.symbol}{amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Wallet Address Card */}
        <div className="balance-card fiat-card">
          <div className="card-header">
            <h2>Wallet Address</h2>
            <span className="currency-badge">
              {user?.wallet_address ? '🟢' : '🔴'}
            </span>
          </div>

          <div className="balance-display">
            {user?.wallet_address ? (
              <a
                href={`https://sepolia.etherscan.io/address/${user.wallet_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="balance-amount"
                style={{
                  fontSize: '18px',
                  textDecoration: 'none',
                  wordBreak: 'break-all'
                }}
              >
                {user.wallet_address.slice(0, 8)}
                ...
                {user.wallet_address.slice(-6)}
              </a>
            ) : (
              <p className="balance-amount">
                No Wallet Connected
              </p>
            )}
          </div>

          <div className="balance-details">
            <div className="balance-row">
              <span>Status</span>
              <span className="amount">
                {user?.wallet_address
                  ? 'Connected'
                  : 'Not Connected'}
              </span>
            </div>

            {user?.wallet_address && (
              <div className="balance-row">
                <span>Address</span>
                <span
                  className="amount"
                  style={{
                    maxWidth: '250px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {user.wallet_address}
                </span>
              </div>
            )}

            {user?.wallet_address && (
              <div className="balance-row">
                <span>Network</span>
                <span className="amount">
                  Sepolia Testnet
                </span>
              </div>
            )}
          </div>
</div>
        {/* Crypto Holdings Card */}
        <div className="balance-card crypto-card">
          <div className="card-header">
            <h2>Crypto Holdings</h2>
            <span className="holdings-count">{Object.keys(wallet.cryptoHoldings).length} Assets</span>
          </div>
          
          {Object.keys(wallet.cryptoHoldings).length > 0 ? (
            <div className="holdings-list">
              {Object.entries(wallet.cryptoHoldings).map(([symbol, quantity]) => (
                <div key={symbol} className="holding-row">
                  <span className="crypto-symbol">{symbol.toUpperCase()}</span>
                  <span className="crypto-quantity">{quantity.toFixed(8)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No crypto holdings yet</p>
              <p className="text-small">Start buying crypto to build your portfolio</p>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="transactions-card">
          <div className="card-header">
            <h2>Recent Transactions</h2>
            <span className="transaction-count">{transactionHistory.length} transactions</span>
          </div>

          {transactionHistory.length > 0 ? (
            <div className="transactions-list">
              {transactionHistory.slice(0, 10).map((txn, idx) => (
                <div key={idx} className={`transaction-row ${txn.type}`}>
                  <div className="txn-info">
                    <span className="txn-type">{txn.type.toUpperCase()}</span>
                    <span className="txn-symbol">{txn.symbol.toUpperCase()}</span>
                  </div>
                  <div className="txn-amount">
                    <span className="quantity">{txn.quantity.toFixed(8)}</span>
                    <span className={`price ${txn.type}`}>{txn.type === 'buy' ? '-' : '+'}{currency.symbol}{txn.usdAmount.toFixed(2)}</span>
                  </div>
                  <div className="txn-time">
                    <span>{new Date(txn.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No transactions yet</p>
              <p className="text-small">Your transaction history will appear here</p>
            </div>
          )}
        </div>

        {/* Blockchain Transactions */}
<div className="transactions-card">
  <div className="card-header">
    <h2>Blockchain Transactions</h2>

    <span className="transaction-count">
      {blockchainTxs.length} transactions
    </span>
  </div>

  {loadingBlockchainTxs ? (
    <div className="empty-state">
      <p>Loading blockchain transactions...</p>
    </div>
  ) : blockchainTxs.length > 0 ? (
    <div className="transactions-list">

      {blockchainTxs.slice(0, 10).map((tx) => (
        <div
          key={tx.hash}
          className={`transaction-row ${
            tx.direction === 'IN'
              ? 'buy'
              : 'sell'
          }`}
        >
          <div className="txn-info">
            <span className="txn-type">
              {tx.direction}
            </span>

            <span className="txn-symbol">
            {tx.hash.slice(0, 10)}...
            </span>
          </div>

          <div className="txn-amount">
            <span className="quantity">
              {tx.amount} ETH
            </span>

            <span
              className={`price ${
                tx.direction === 'IN'
                  ? 'buy'
                  : 'sell'
              }`}
            >
              {tx.direction}
            </span>
          </div>

          <div className="txn-time">
            <span>{tx.age}</span>
          </div>
        </div>
      ))}

    </div>
  ) : (
    <div className="empty-state">
      <p>No blockchain transactions found</p>

      <p className="text-small">
        MetaMask transaction history will appear here
      </p>
    </div>
  )}
</div>

        {/* Wallet Statistics */}
        <div className="stats-card">
          <div className="card-header">
            <h2>Wallet Stats</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Assets</span>
              <span className="stat-value">
                {Object.keys(wallet.cryptoHoldings).length + Object.keys(wallet.fiatBalance).length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Fiat Currencies</span>
              <span className="stat-value">{Object.keys(wallet.fiatBalance).length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Crypto Assets</span>
              <span className="stat-value">{Object.keys(wallet.cryptoHoldings).length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Transactions</span>
              <span className="stat-value">{transactionHistory.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wallet
