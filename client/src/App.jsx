
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home.jsx'
import { Signin } from './pages/Signin.jsx'
import { Signup } from './pages/Signup.jsx'
import Problems from './pages/Problems.jsx'
import Profile from './pages/Profile.jsx'
import ProblemDetails from './pages/ProblemDetails.jsx'
import Submissions from './pages/Submissions.jsx'
import UploadProblems from './pages/UploadProblems.jsx'
import Users from './pages/Users.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Forgot from './pages/Forgot.jsx'
import Compiler from './pages/Compiler.jsx'
function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path='/' element={<Home />} /> {/* Unprotected route */}
          <Route path='/signin' element={<Signin />} /> {/* Unprotected route */}
          <Route path='/signup' element={<Signup />} /> {/* Unprotected route */}
          <Route path='/problems' element={<Problems />} /> {/* Unprotected route */}
          <Route path='/problems/:id' element={<ProblemDetails />} /> {/* Protected route */}
          <Route path='/profile' element={<Profile />} /> {/* Protected route */}
          {/*<Route path='/logout' element={<Home />} /> {/* Unprotected route */} 
          <Route path='/run' element={<Home />} /> {/* Unprotected route need to check*/}
          <Route path='/submissions' element={<Submissions />} /> {/* Protected route */}
          <Route path='/uploadProblem' element={<UploadProblems />} /> {/* Protected route */}
          <Route path='/users' element={<Users />} /> {/* Protected route */}
          <Route path='/leaderboard' element={<Leaderboard />} /> {/* Unprotected route */}
          <Route path='/forgot-password' element={<Forgot />} />
          <Route path='/compiler' element={<Compiler />} /> {/* Unprotected route */}
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          draggable
          theme="dark"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App 