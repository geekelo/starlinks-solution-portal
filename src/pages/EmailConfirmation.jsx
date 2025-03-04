import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/EmailConfirmation.css';

const EmailConfirmation = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('OTP submitted:', otp);
    // Add logic to verify the OTP here
    // For example, call an API to verify the OTP
    // If successful, navigate to the login page
    navigate('/login');
  };

  const handleResendOtp = async () => {
    // Logic to resend the OTP
    console.log('Resending OTP...');
    // Call the API to resend the OTP
  };

  return (
    <>
      <Navbar />
      <div className="email-confirmation-container">
        <div className="email-confirmation-content">
          <div className="email-confirmation-header">
            <h1>Enter Your Code</h1>
            <p>Please enter the 6-digit OTP sent to your email</p>
          </div>

          <form className="email-confirmation-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter your OTP code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6} // Limit to 6 digits
              />
            </div>

            <button type="submit" className="confirm-button">
              Submit
            </button>
            <button type="button" className="resend-button" onClick={handleResendOtp}>
              Resend OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmailConfirmation;
