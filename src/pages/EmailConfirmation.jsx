import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/EmailConfirmation.css';

const EmailConfirmation = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email confirmed');
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div className="email-confirmation-container">
        <div className="email-confirmation-content">
          <div className="email-confirmation-header">
            <h1>Confirm Your Email</h1>
            <p>Please enter your email address for confirmation</p>
          </div>

          <form className="email-confirmation-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </div>

            <button type="submit" className="confirm-button">
              Confirm Email
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmailConfirmation;
