import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './styles/App.css';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ActivateCode from './pages/ActivateCode';
import EmailConfirmation from './pages/EmailConfirmation';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Profile from './pages/Profile';

const App = () => (
  <Router>
    <div className="app">
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/activate" element={<ActivateCode />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Navigate to="/signup" replace />} />
      </Routes>
    </div>
  </Router>
);

export default App;
