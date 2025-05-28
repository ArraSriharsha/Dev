import { useState } from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { Signin } from './pages/Signin.jsx'
import { Signup } from './pages/Signup.jsx'
import Problems from './pages/Problems.jsx'
import Profile from './pages/Profile.jsx'
import ProblemDetails from './pages/ProblemDetails.jsx'
import Submissions from './pages/Submissions.jsx'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Signin />} />
          <Route path='/home' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/problems' element={<Problems />} />
          <Route path='/problems/:id' element={<ProblemDetails />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/logout' element={<Home />} />
          <Route path='/run' element={<Home />} />
          <Route path='/submissions' element={<Submissions />} />
        </Routes>
      </Router>
    </>
  )
}

export default App 