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
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);
  const [whatsappStep, setWhatsappStep] = useState(1); // Step 1: Connect to sandbox, Step 2: OTP verification

  const handleInputChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleRequestCode = async () => {
    setIsResending(true);
    try {
      await onRequestCode();
      setCodeRequested(true);
      toast.success('Verification code sent successfully!');
    } catch (error) {
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'email') {
      onVerify();
    } else if (showPhoneInput) {
      onPhoneSubmit(phoneNumber);
    } else {
      const verificationCode = code.join('');
      onVerify(verificationCode);
    }
  };

  const maskedEmail = email?.replace(/(.{3})(.*)(@.*)/, '$1***$3');
  const maskedPhone = phone?.replace(/(\d{3})\d{6}(\d{2})/, '$1******$2');

  const renderWhatsAppStep1 = () => (
    <>
      <h2>Connect to WhatsApp</h2>
      <p>First, connect your WhatsApp number to our sandbox</p>
      <div className="whatsapp-connect-section">
        <div className="connection-options">
          <div className="qr-code-section">
            <p>Scan QR code with your phone:</p>
            <img 
              src="/qrcode.png" 
              alt="WhatsApp QR Code" 
              className="whatsapp-qr"
            />
          </div>
          <div className="divider">
            <span>OR</span>
          </div>
          <div className="link-section">
            <a 
              href="https://wa.me/14155238886?text=join%20wrong-favorite" 
              target="_blank" 
              rel="noopener noreferrer"
              className="whatsapp-connect-link"
            >
              Click to connect to sandbox
            </a>
          </div>
        </div>
        <button
          type="button"
          className="continue-button"
          onClick={() => setWhatsappStep(2)}
        >
          I've connected, continue to verification
        </button>
      </div>
    </>
  );

  const renderWhatsAppStep2 = () => (
    <>
      <h2>Verify your WhatsApp number</h2>
      <p>Enter the verification code sent to {maskedPhone}</p>
      <form onSubmit={handleSubmit}>
        {!codeRequested && (
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

        {codeRequested && (
          <>
            <div className="verification-code-inputs">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  id={`code-${index}`}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  pattern="[0-9]"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                />
              ))}
            </div>

            <button
              type="button"
              className="resend-button"
              onClick={handleRequestCode}
              disabled={isResending}
            >
              {isResending ? 'Resending...' : 'Did not get the code? Resend'}
            </button>

            <div className="verification-actions">
              <button
                type="submit"
                className="continue-button"
                disabled={code.some((digit) => !digit)}
              >
                Verify Code
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
              <h2>Verify your email address</h2>
              <p>Click continue to receive a verification link at {maskedEmail}</p>
              <form onSubmit={handleSubmit}>
                <div className="verification-actions">
                  <button type="submit" className="continue-button">
                    Send Verification Link
                  </button>
                </div>
              </form>
            </>
          ) : (
            type === 'phone' && (whatsappStep === 1 ? renderWhatsAppStep1() : renderWhatsAppStep2())
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
};

export default VerificationModal; 