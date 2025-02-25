import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { createAxiosInstance } from '../config/axios';
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

  const mapStatus = (status) => {
    const statusMap = {
      pending: 'awaiting approval',
      active: 'online',
      inactive: 'offline',
      deactivated: 'disconnected',
      expiring: 'expiring soon'
    };
    return statusMap[status] || status;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting form with data:", formData); // Log form data

    try {
      const axiosInstance = createAxiosInstance();
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData'));
      const kitNumber = localStorage.getItem('tempKitNumber');

      const response = await axiosInstance.post(
        '/api/v1/starlink_kits',
        {
          starlink_kit: {
            kit_number: kitNumber,
            address: formData.address,
            nin: formData.nin,
            company_name: formData.company_name,
            company_number: formData.company_number,
            starlink_user_id: userData.id
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Starlink kit creation response:', response); // Log full response

      if (response.data.success) { // Check success from the full response
        localStorage.removeItem('tempKitNumber');
        toast.success('Starlink kit added successfully!');
        onSubmit({
          ...response.data.starlink_kit,
          status: mapStatus(response.data.starlink_kit.status)
        });
        console.log("Closing modal after successful submission"); // Log before closing
        onClose(); // Close the modal after successful submission
      }
    } catch (error) {
      console.error('Error creating starlink kit:', error);
      toast.error(error.response?.data?.message || 'Failed to add Starlink kit. Please try again.');
    } finally {
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


          <div className="form-group">
            <label htmlFor="company_number">Company Registration Number (Optional)</label>
            <input
              type="text"
              id="company_number"
              name="company_number"
              value={formData.company_number}
              onChange={handleChange}
              aria-labelledby="company_number"
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
