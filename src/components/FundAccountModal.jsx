import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Modal.css';
import { createAxiosInstance } from '../config/axios';
import { toast } from 'react-toastify';

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
    
    const token = localStorage.getItem('token');
    const walletId = localStorage.getItem('starlink_walletId');
    const userData = JSON.parse(localStorage.getItem('userData'));
    const payload = {
      starlink_wallet_funding: {
        starlink_user_wallet_id: walletId,
        amount: formData.amount,
        payment_method: formData.paymentMethod,
        starlink_user_id: userData.id
      }
    };

    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance.post(`/api/v1/starlink_wallet_fundings`, payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Funding Response:', response.data);
      toast.success('Wallet funded successfully!');
      onSubmit({
        referenceNumber: response.data.referenceNumber,
        method: formData.paymentMethod,
        amount: formData.amount
      });
      onClose(); // Close the modal after successful funding
      localStorage.setItem('fundingId', response.data.funding.id);
    } catch (error) {
      console.error('Error funding wallet:', error);
      toast.error('Failed to fund wallet. Please try again.');
    }
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