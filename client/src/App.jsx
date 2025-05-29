
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

function App() {
  return (
    <Router>
      <div className="app-container">
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
          <Route path='/uploadProblem' element={<UploadProblems />} />
          <Route path='/users' element={<Users />} />
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