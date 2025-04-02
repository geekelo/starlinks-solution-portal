import PropTypes from 'prop-types';
import '../styles/Modal.css';
import { createAxiosInstance } from '../config/axios';
import { toast } from 'react-toastify';
import { AiOutlineCopy } from "react-icons/ai";
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentDetailsModal = ({ onClose, paymentDetails }) => {
  const { referenceNumber, method } = paymentDetails;
  const reference = localStorage.getItem('reference');
  const fundingId = localStorage.getItem('fundingId');
  const amount = localStorage.getItem('PaymentAmount');
  const navigate = useNavigate();
  const bankDetails = {
    bankName: 'Kuda Microfinance Bank',
    accountNumber: '3000865987',
    accountName: 'Starlink Installation Solutions',
  };

  const onlinePaymentUrl = 'https://payment-gateway.example.com';

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Account number copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy account number.');
    });
  };
  const handleSubmit = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const token = localStorage.getItem('token');
      const fundingId = localStorage.getItem('fundingId');

      const payload = {
        starlink_wallet_funding: { paid: "yes" }
      };

      await axiosInstance.put(`/api/v1/starlink_wallet_fundings/confirm_request?id=${fundingId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Thanks for confirming, your wallet would be credited when payment is received!');

      // Close modal and navigate to billing page
      onClose();
      navigate('/billing');

      // Wait for navigation before scrolling
      setTimeout(() => {
        const billingTable = document.getElementById('billing-table'); // Make sure the table has this ID
        if (billingTable) {
          billingTable.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Timeout to ensure the page loads first
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Failed to confirm payment. Please try again.');
    }
  };
  return (
    <div className="modal-overlay payment-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Payment Details</h2>
          <button 
            type="button" 
            className="close-button" 
            onClick={() => {
              onClose(); 
              navigate('/billing#history');
            }}
          >
            ×
          </button>
        </div>

        <div className="payment-details">
          <div className="info-group">
            <label className='payment-ref'>Reference Number</label>
            <p className="reference-number">{reference}</p>
            <p className="reference-instruction">Please include this reference number when making your payment</p>
          </div>

          {method === 'offline' ? (
            <div className="bank-details">
              <h3>Bank Transfer Details</h3>
              <div className="info-group">
                <label className='bank-name'>Bank Name</label>
                <p >{bankDetails.bankName}</p>
              </div>
              <div className="info-group">
                <label className='bank-name'>Amount</label>
                <p>{amount}</p>
              </div>
              <div className="info-group">
                <label className='bank-name'>Account Number</label>
                <div className='payment-copy'>
                <p>{bankDetails.accountNumber}</p>
                <button onClick={() => copyToClipboard(bankDetails.accountNumber)} className="copy-button">
               Copy <AiOutlineCopy size={20} />
                </button>
                </div>
              </div>
              <div className="info-group">
                <label className='bank-name'>Account Name</label>
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