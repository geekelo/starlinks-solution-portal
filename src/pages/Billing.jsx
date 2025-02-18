import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/Billing.css';

const Billing = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Feb - Mar');

  return (
    <>
      <Navbar />
      <div className="billing-container">
        <div className="billing-header">
          <h1>Billing</h1>
          <p>Manage your invoices and payments.</p>
        </div>

        <div className="billing-content">
          <div className="billing-grid">
            <div className="billing-card">
              <div className="card-header">
                <h2>Balance Due</h2>
                <button type="button" className="pay-button">Pay</button>
              </div>
              <div className="amount-display">
                <span className="currency">NGN</span>
                <span className="amount">0.00</span>
                <span className="check-icon">✓</span>
              </div>
            </div>

            <div className="billing-card">
              <div className="card-header">
                <h2>Available Service Credits</h2>
                <button type="button" className="info-button" aria-label="Information">ⓘ</button>
              </div>
              <div className="amount-display">
                <span className="currency">NGN</span>
                <span className="amount">159,000.00</span>
              </div>
            </div>

            <div className="billing-card">
              <div className="card-header">
                <h2>Billing Cycle</h2>
                <button type="button" className="info-button" aria-label="Information">ⓘ</button>
              </div>
              <div className="cycle-info">
                <p>Your billing period is January 18 - February 17.</p>
                <p>Payment due January 18.</p>
              </div>
            </div>

            <div className="billing-card">
              <div className="card-header">
                <h2>Payment Method</h2>
                <button type="button" className="edit-button">Edit</button>
              </div>
              <div className="payment-info">
                <p className="name">Elo Otiede</p>
                <p className="card">MasterCard ending in 0100</p>
                <p className="expiry">Expires: 6/27</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Billing;
