import React, { useState, useEffect } from 'react'
import './News.css'

const News = () => {
  const [newsData, setNewsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCryptoNews = async () => {
      try {
        setLoading(true)
        
        // Small delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Use reliable mock data
        setNewsData(getMockNewsData())
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching crypto news:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCryptoNews()
  }, [])

  const getMockNewsData = () => {
    return [
      {
        title: "Bitcoin Reaches New All-Time High as Institutional Adoption Grows",
        url: "https://coindesk.com",
        icon: "₿",
        gradient: "linear-gradient(135deg, #f7931a 0%, #f9a825 100%)",
        sources: [{ title: "CoinDesk" }]
      },
      {
        title: "Ethereum Network Upgrade Enhances Security and Performance",
        url: "https://ethereum.org",
        icon: "Ξ",
        gradient: "linear-gradient(135deg, #627eea 0%, #764ce3 100%)",
        sources: [{ title: "Ethereum Foundation" }]
      },
      {
        title: "Regulatory Framework for Cryptocurrencies Announced by G20",
        url: "https://g20.org",
        icon: "📋",
        gradient: "linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)",
        sources: [{ title: "G20 Summit" }]
      },
      {
        title: "DeFi Protocol Launches Innovative Yield Farming Features",
        url: "https://defi.example.com",
        icon: "🌾",
        gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        sources: [{ title: "DeFi Pulse" }]
      },
      {
        title: "Central Banks Explore Digital Currency Development",
        url: "https://bis.org",
        icon: "🏦",
        gradient: "linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%)",
        sources: [{ title: "BIS" }]
      },
      {
        title: "Major Exchange Implements Advanced Security Features",
        url: "https://binance.com",
        icon: "🔐",
        gradient: "linear-gradient(135deg, #f9b233 0%, #f97316 100%)",
        sources: [{ title: "Binance Blog" }]
      },
      {
        title: "Cryptocurrency Market Analysis: Q1 2026 Summary Report",
        url: "https://example.com",
        icon: "📊",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ce3 100%)",
        sources: [{ title: "Crypto Markets" }]
      }
      
      
      
      
      
    ]
  }

  if (loading) {
    return (
      <div className="news-container">
        <div className="news-spinner">
          <div className="spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="news-container">
        <div className="error-message">
          <p>Failed to load news: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="news-container">
      <h2 className="news-title">Crypto News</h2>
      <div className="news-row">
        {newsData && newsData.length > 0 ? (
          newsData.map((article, index) => (
            <div key={index} className="news-column">
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="news-card"
              >
                <div className="news-image-wrapper" style={{ background: article.gradient }}>
                  <div className="news-icon">{article.icon}</div>
                  <div className="news-overlay"></div>
                </div>
                <div className="news-content">
                  <h3 className="news-article-title">{article.title}</h3>
                  <p className="news-source">
                    {article.sources && article.sources[0]?.title}
                  </p>
                </div>
              </a>
            </div>
          ))
        ) : (
          <div className="no-news">
            <p>No news articles available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default News
