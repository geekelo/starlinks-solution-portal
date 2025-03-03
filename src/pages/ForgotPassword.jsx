import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/ForgotPassword.css';
import WhatsAppButton from '../components/WhatsAppButton';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reset email sent to:', email);
    setIsSubmitted(true);

    setTimeout(() => {
      navigate('/reset-password');
    }, 3000);
  };

  return (
    <>
      <Navbar />
      <div className="forgot-password-container">
        <div className="forgot-password-content">
          <div className="forgot-password-header">
            <h1>Reset Password</h1>
            <p>Enter your email to receive a password reset link</p>
          </div>

          {!isSubmitted ? (
            <form className="forgot-password-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button type="submit" className="reset-button">
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="success-message">
              <p>
                If an account exists for {email}, you will receive a password reset link shortly.
              </p>
            </div>
          )}
        </div>
      </div>
      <WhatsAppButton />
    </>
  );
};

export default ForgotPassword; 