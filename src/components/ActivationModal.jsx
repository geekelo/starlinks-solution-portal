import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { createAxiosInstance } from '../config/axios';
import '../styles/Modal.css';

const ActivationModal = ({ onClose, onActivate }) => {
  const [activationCode, setActivationCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const checkKitNumber = async (kitNumber) => {
    try {
      const axiosInstance = createAxiosInstance();
      const token = localStorage.getItem('token');
      
      const { data } = await axiosInstance.get(
        `/api/v1/starlink_kits/check_kit_number?kit_number=${kitNumber}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return data.exists;
    } catch (error) {
      console.error('Error checking kit number:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsChecking(true);

    try {
      const exists = await checkKitNumber(activationCode);
      
      if (exists) {
        toast.error('This kit number is already registered.');
      } else {
        // Store the kit number temporarily
        localStorage.setItem('tempKitNumber', activationCode);
        onActivate({
          kitNumber: activationCode,
          status: 'pending'
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check kit number. Please try again.');
    } finally {
      setIsChecking(false);
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
            <label htmlFor="activationCode">Kit number</label>
            <input
              type="text"
              id="activationCode"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              placeholder="Enter your kit number"
              required
              aria-labelledby="activationCode"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="modal-submit-button"
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ActivationModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onActivate: PropTypes.func.isRequired,
};

export default ActivationModal;
