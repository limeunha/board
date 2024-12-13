import { Route, Routes } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import './styles/common.css'
import Home from './pages/Home'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'

function App() {
   return (
      <>
         <Navbar isAuthenticated={false} />
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
         </Routes>
      </>
   )
}

export default App
