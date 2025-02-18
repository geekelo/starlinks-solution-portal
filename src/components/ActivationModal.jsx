import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Modal.css';

const ActivationModal = ({ onClose, onActivate }) => {
  const [activationCode, setActivationCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onActivate(activationCode);
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
            <label htmlFor="activationCode">Activation Code</label>
            <input
              type="text"
              id="activationCode"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              placeholder="Enter your activation code"
              required
              aria-labelledby="activationCode"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Activate
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
