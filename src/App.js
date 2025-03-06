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

// Function to check if the user is logged in
const isAuthenticated = () => {
  return localStorage.getItem('userData') !== null;
};

// Protected route component
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const App = () => (
  <Router>
    <div className="app">
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/activate" element={<ActivateCode />} />

        {/* Protected Routes */}
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/dashboard/:kitId" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/billing" element={<PrivateRoute element={<Billing />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />

        {/* Redirect to login if no route matches */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  </Router>
);

export default App;
