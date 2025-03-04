import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import '../styles/Modal.css';

const StarlinkDetailsModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    address: '',
    nin: '',
    company_name: '',
    company_number: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    // Simply pass the form data to the parent component
    onSubmit(formData);
    // The modal will be closed by the parent component
  } catch (error) {
    console.error('Error in form submission:', error);
    toast.error('Failed to process form. Please try again.');
    setIsSubmitting(false);
  }
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
            <label htmlFor="company_name">Name of Kit User (Use Company name  / Perosnal Name)</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              aria-labelledby="company_name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Full Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              aria-labelledby="address"
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

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Starlink'}
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
