import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createAxiosInstance } from '../config/axios';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    starlink_user: {
      email: '',
      password: ''
    }
  });
  const [loading, setLoading] = useState(false);

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
      
      console.log('Login Response:', data);

      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login. Please try again.');
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
