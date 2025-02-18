import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the login logic
    console.log('Login submitted');
    // Redirect to home page
    navigate('/home');
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <h1>Log In</h1>
            <p>Access your Starlink account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="email" id="email" name="email" placeholder="Email Address" required />
            </div>

            <div className="form-group">
              <input type="password" id="password" name="password" placeholder="Password" required />
            </div>

            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
