import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/VerificationModal.css';
import { toast } from 'react-toastify';

const VerificationModal = ({
  type,
  email = '',
  phone = '',
  onVerify,
  onRequestCode,
  onPhoneSubmit = () => {},
  showPhoneInput = false,
  handleEmailVerification,
  handleEmailCodeVerification,
  handleRequestWhatsAppCode,
  handlePhoneVerification,
}) => {
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCodeRequested, setIsCodeRequested] = useState(false);
  const [whatsappStep, setWhatsappStep] = useState(1); // Step 1: Connect to sandbox, Step 2: OTP verification

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleRequestCode = async () => {
    if (type === 'email') {
      await onVerify();
      setIsCodeRequested(true);
    } else if (type === 'phone') {
      // This is the fixed line - calling the prop function instead of accessing it directly
      await handleRequestWhatsAppCode();
      setIsCodeRequested(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === 'email') {
      await handleEmailCodeVerification(code);
    } else if (type === 'phone') {
      await handlePhoneVerification(code);
    } else if (showPhoneInput) {
      onPhoneSubmit(phone);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await onRequestCode();
      toast.success('Verification code resent successfully!');
    } catch (error) {
      toast.error('Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // This function should be removed or modified as it's causing confusion
  // It's trying to use handleRequestWhatsAppCode as if it were a local function
  // But it's actually a prop that's passed in
  const handleVerification = () => {
    handleRequestWhatsAppCode(code);
  };

  const maskedEmail = email?.replace(/(.{3})(.*)(@.*)/, '$1***$3');
  const maskedPhone = phone?.replace(/(\d{3})\d{6}(\d{2})/, '$1******$2');

  const renderWhatsAppStep2 = () => (
    <>
      <h2>Verify your Phone number</h2>
      <p>Enter the verification code sent to {maskedPhone}</p>
      <form onSubmit={handleSubmit}>
        {!isCodeRequested && (
          <div className="verification-actions" style={{ marginBottom: '1.5rem' }}>
            <button
              type="button"
              className="continue-button"
              onClick={handleRequestCode}
              disabled={isResending}
            >
              {isResending ? 'Sending Code...' : 'Request Verification Code'}
            </button>
          </div>
        )}

        {isCodeRequested && (
          <>
            <div className="verification-code-inputs">
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="Enter your code"
                required
                maxLength={6}
              />
            </div>

            <div className="verification-actions">
              <button
                type="submit"
                className="continue-button"
                disabled={!code}
              >
                Verify Code
              </button>
              <button
                type="button"
                className="resend-button"
                onClick={handleResendCode}
                disabled={isResending}
              >
                {isResending ? 'Resending...' : 'Resend Code'}
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );

  return (
    <div className="verification-modal-overlay">
      <div className="verification-modal">
        <div className="verification-modal-content">
          <div className="verification-icon">
            {type === 'email' ? '✉️' : '📱'}
          </div>
          {type === 'email' ? (
            <>
              <h2>{isCodeRequested ? 'Enter Your Verification Code' : 'Request Verification Code'}</h2>
              <p>
                {isCodeRequested
                  ? `Please enter the 6-digit code sent to spam folder of the email ${maskedEmail}`
                  : 'Click the button below to receive a verification code.'}
              </p>
              <form onSubmit={handleSubmit}>
                {isCodeRequested ? (
                  <>
                    <div className="form-group">
                      <input
                        type="text"
                        value={code}
                        onChange={handleCodeChange}
                        placeholder="Enter your code"
                        required
                        maxLength={6}
                        className="verification-input"
                      />
                    </div>
                    <button type="submit" className="continue-button">
                      Verify Code
                    </button>
                  </>
                ) : (
                  <button type="button" className="continue-button" onClick={handleRequestCode}>
                    Request Code
                  </button>
                )}
              </form>
            </>
          ) : (
            type === 'phone' && renderWhatsAppStep2()
          )}
        </div>
      </div>
    </div>
  );
};

VerificationModal.propTypes = {
  type: PropTypes.oneOf(['email', 'phone']).isRequired,
  email: PropTypes.string,
  phone: PropTypes.string,
  onVerify: PropTypes.func.isRequired,
  onRequestCode: PropTypes.func,
  onPhoneSubmit: PropTypes.func,
  showPhoneInput: PropTypes.bool,
  handleEmailVerification: PropTypes.func,
  handleEmailCodeVerification: PropTypes.func,
  handleRequestWhatsAppCode: PropTypes.func.isRequired,
  handlePhoneVerification: PropTypes.func.isRequired,
};

export default VerificationModal;