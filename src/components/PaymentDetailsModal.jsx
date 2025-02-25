import PropTypes from 'prop-types';
import '../styles/Modal.css';
import { createAxiosInstance } from '../config/axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const PaymentDetailsModal = ({ onClose, paymentDetails }) => {
  const { referenceNumber, method } = paymentDetails;
  const reference = localStorage.getItem('walletId');
  const fundingId = localStorage.getItem('fundingId');
  const bankDetails = {
    bankName: 'First Bank',
    accountNumber: '0123456789',
    accountName: 'Starlinks Solutions Ltd',
  };

  const onlinePaymentUrl = 'https://payment-gateway.example.com';

  const handleSubmit = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const token = localStorage.getItem('token');
      const payload = {
        starlink_wallet_funding: {
          paid: "yes"
        }
      };
      
      const response = await axiosInstance.put(`/api/v1/starlink_wallet_fundings/confirm_request?id=${fundingId}`,
         payload,
         {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
      console.log('Confirmation Response:', response.data);
      toast.success('Payment confirmed successfully!');
      onClose(); 
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Failed to confirm payment. Please try again.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); 
    }, 15000); 

    return () => clearTimeout(timer); 
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Payment Details</h2>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="payment-details">
          <div className="info-group">
            <label>Reference Number</label>
            <p className="reference-number">{reference}</p>
            <p className="reference-instruction">Please include this reference number when making your payment</p>
          </div>

          {method === 'offline' ? (
            <div className="bank-details">
              <h3>Bank Transfer Details</h3>
              <div className="info-group">
                <label>Bank Name</label>
                <p>{bankDetails.bankName}</p>
              </div>
              <div className="info-group">
                <label>Account Number</label>
                <p>{bankDetails.accountNumber}</p>
              </div>
              <div className="info-group">
                <label>Account Name</label>
                <p>{bankDetails.accountName}</p>
              </div>
            </div>
          ) : (
            <div className="online-payment">
              <h3>Online Payment</h3>
              <p>Click the button below to proceed with online payment</p>
              <a 
                href={onlinePaymentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="online-payment-button"
              >
                Pay Online
              </a>
            </div>
          )}
          <div className="modal-actions">
            <p className="confirmation-instruction">Please click the button below only if payment has been made.</p>
            <button type="button" className="submit-button confirm-button" onClick={handleSubmit}>Click to Confirm Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

PaymentDetailsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  paymentDetails: PropTypes.shape({
    referenceNumber: PropTypes.string.isRequired,
    method: PropTypes.oneOf(['online', 'offline']).isRequired
  }).isRequired
};

export default PaymentDetailsModal; 