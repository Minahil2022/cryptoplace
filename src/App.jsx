import React, { useState } from 'react'
import Navbar from './component/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Coin from './pages/Coin/Coin'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Wallet from './pages/Wallet/Wallet'
import News from './component/News/News'
import Footer from './component/Footer/Footer'
import ChatBot from './component/ChatBot/ChatBot'
const App = () => {

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi 👋 I am your Crypto AI Assistant. Ask me anything about crypto, Bitcoin, Ethereum, trading, etc."
    }
  ]);

  return (
    <div className='app'>
      
      <Navbar setShowChat={setShowChat} />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/coin/:coinId' element={<Coin />} />
        <Route path='/wallet' element={<Wallet />} />
        <Route path='/news' element={<News />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
      {showChat && (
        <ChatBot
          setShowChat={setShowChat}
          messages={messages}
          setMessages={setMessages}
        />
      )}
      

      <Footer />

    </div>
  )
}

export default App