import { useState } from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import {Signin} from './pages/Signin.jsx'
import {Signup} from './pages/Signup.jsx'
import Problems from './pages/Problems.jsx'

function App() {
 

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Signin />} />
          <Route path='/home' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/problems' element={<Problems />} />
        </Routes>
      </Router>
    </>
  )
}

export default App 