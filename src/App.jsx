import React from 'react'
import Navbar from './component/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Coin from './pages/Coin/Coin'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import News from './component/News/News'
import Footer from './component/Footer/Footer'

const App = () => {
  return (
    <div className='app'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/> 
        <Route path='/coin/:coinId' element={<Coin/>}/>
        <Route path='/news' element={<News/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
