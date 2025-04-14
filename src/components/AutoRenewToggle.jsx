import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { createAxiosInstance } from '../config/axios';
import '../styles/AutoRenewToggle.css';

const AutoRenewToggle = ({ kitId, initialStatus = false }) => {
  const [isEnabled, setIsEnabled] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      const axiosInstance = createAxiosInstance();
      const token = localStorage.getItem('token');
      
      await axiosInstance.put(
        '/api/v1/starlink_kits/set_auto_renew',
        { 
          id: kitId,
          auto_renew: !isEnabled 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setIsEnabled(!isEnabled);
      toast.success(`Auto-renew ${!isEnabled ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      console.error('Error updating auto-renew status:', error);
      toast.error('Failed to update auto-renew settings. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="auto-renew-toggle-container">
      <div className="toggle-wrapper">
        <label className="toggle-switch" aria-label={`Auto-renew ${isEnabled ? 'enabled' : 'disabled'}`}>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={handleToggle}
            disabled={isUpdating}
          />
          <span className="toggle-slider"></span>
        </label>
        <span className={`toggle-label ${isUpdating ? 'updating' : ''}`}>
          {isUpdating ? 'Updating...' : isEnabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>
    </div>
  );
};

AutoRenewToggle.propTypes = {
  kitId: PropTypes.number.isRequired,
  initialStatus: PropTypes.bool,
};

export default AutoRenewToggle;