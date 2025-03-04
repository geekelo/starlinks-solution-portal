import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/ResetPassword.css';
import WhatsAppButton from '../components/WhatsAppButton';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div className="reset-password-container">
        <div className="reset-password-content">
          <div className="reset-password-header">
            <h1>Create New Password</h1>
            <p>Please enter your new password</p>
          </div>

          <form className="reset-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="reset-button">
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <WhatsAppButton />
    </>
  );
};

export default ResetPassword; 