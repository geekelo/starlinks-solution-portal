import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/Modal.css';
import { createAxiosInstance } from '../config/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FundAccountModal = ({ onClose, onSubmit, defaultAmount }) => {
  const [formData, setFormData] = useState({
    amount: defaultAmount || '',
    paymentMethod: 'offline' // default to offline
  });

  useEffect(() => {
    // Update amount when defaultAmount changes
    if (defaultAmount) {
      setFormData(prev => ({
        ...prev,
        amount: defaultAmount
      }));
    }
  }, [defaultAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const walletId = localStorage.getItem('starlink_walletId');
    localStorage.setItem('PaymentAmount', formData.amount);
  
    const payload = {
      starlink_wallet_funding: {
        starlink_user_wallet_id: walletId,
        amount: formData.amount,
        payment_method: formData.paymentMethod,
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

      toast.success('Funding process  started. Please proceed to make payment.');
      onSubmit({
        referenceNumber: response.data.referenceNumber,
        method: formData.paymentMethod,
        amount: formData.amount
      });
      navigate('/billing#history');
      onClose(); // Close the modal after successful funding

      localStorage.setItem('fundingId', response.data.funding.id);
      localStorage.setItem('reference', response.data.funding.reference);
      console.log(response.data.funding.reference)

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
                  className="payment-mode"
                  checked={formData.paymentMethod === 'offline'}
                  onChange={handleChange}
                />
                <span className="payment-mode">
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
  onSubmit: PropTypes.func.isRequired,
  defaultAmount: PropTypes.string
};

export default FundAccountModal; 