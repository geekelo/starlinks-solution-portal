import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Modal.css';

const FundAccountModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'offline' // default to offline
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simulate API call response
    const mockApiResponse = {
      referenceNumber: `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      method: formData.paymentMethod,
      amount: formData.amount
    };

    onSubmit(mockApiResponse);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Fund Account</h2>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="form-group">
            <label>Select Payment Method</label>
            <div className="radio-group">
              <label className={`radio-label ${formData.paymentMethod === 'offline' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="offline"
                  checked={formData.paymentMethod === 'offline'}
                  onChange={handleChange}
                />
                <span>
                  🏦 Offline Payment (Bank Transfer)
                </span>
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Proceed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

FundAccountModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default FundAccountModal; 