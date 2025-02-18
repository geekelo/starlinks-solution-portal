import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Modal.css';

const StarlinkDetailsModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullAddress: '',
    nin: '',
    companyName: '',
    companyRegNumber: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Starlink</h2>
          <button type="button" className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullAddress">Full Address</label>
            <input
              type="text"
              id="fullAddress"
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleChange}
              required
              aria-labelledby="fullAddress"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nin">NIN</label>
            <input
              type="text"
              id="nin"
              name="nin"
              value={formData.nin}
              onChange={handleChange}
              required
              aria-labelledby="nin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyName">Company Name (Optional)</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              aria-labelledby="companyName"
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyRegNumber">Company Registration Number (Optional)</label>
            <input
              type="text"
              id="companyRegNumber"
              name="companyRegNumber"
              value={formData.companyRegNumber}
              onChange={handleChange}
              aria-labelledby="companyRegNumber"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Starlink
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

StarlinkDetailsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default StarlinkDetailsModal;
