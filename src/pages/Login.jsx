import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createAxiosInstance } from '../config/axios';
import '../styles/Login.css';
import WhatsAppButton from '../components/WhatsAppButton';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    starlink_user: {
      email: '',
      password: ''
    }
  });
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  const isLoggedIn = !!localStorage.getItem('token');

  // If logged in, redirect to home
  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      starlink_user: {
        ...prevState.starlink_user,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const axiosInstance = createAxiosInstance();
      const { data } = await axiosInstance.post('/api/v1/login', {
        starlink_user: {
          email: formData.starlink_user.email,
          password: formData.starlink_user.password
        }
      });

      localStorage.setItem('userData', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Incorrect Email or Password. Please try again or create an account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-form-section">
          <div className="login-content">
            <div className="login-header">
              <h1>Log In</h1>
              <p>Access your Starlink account</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.starlink_user.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.starlink_user.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>

              <div className="forgot-password">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
              <div className="login-link">
                Don't have an account?
                {' '}
                <Link to="/signup">Sign up</Link>
              </div>
            </form>
          </div>
        </div>
        <div className="login-image-section" />
      </div>
      <WhatsAppButton />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default Login;