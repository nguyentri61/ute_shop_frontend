import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Profile from './pages/Profile';
import VerifyOTP from './pages/VerifyOTP';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
      </Routes>
    </Router>
  );
}

export default App;
