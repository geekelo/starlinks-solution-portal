import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPassword.css';
import WhatsAppButton from '../components/WhatsAppButton';
import { createAxiosInstance } from '../config/axios'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  AiOutlineLoading3Quarters } from 'react-icons/ai';

const api = createAxiosInstance();

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/v1/password_resets', {
        email: email
      });

      console.log('Forgot password response:', response.data);
      toast.success('Reset link has been sent to your email!');

      // Wait for the success message to be shown before redirecting
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Forgot password error:', error);
      let errorMessage = 'Failed to send reset link. Please try again.';

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="forgot-password-container">
        <div className="forgot-password-content">
          <div className="forgot-password-header">
            <h1>Forgot Password?</h1>
            <p>Enter your email address and we&apos;ll send you a link to reset your password.</p>
          </div>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="reset-button" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="fa-spin" />
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>

            
          </form>
        </div>
      </div>
      <WhatsAppButton />
    </>
  );
};

export default ForgotPassword; 