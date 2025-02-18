import { useState } from 'react';
import Navbar from '../components/Navbar';
import ActivationModal from '../components/ActivationModal';
import StarlinkDetailsModal from '../components/StarlinkDetailsModal';
import '../styles/Home.css';

const Home = () => {
  const [currentAccount, setCurrentAccount] = useState('Maritime');
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [starlinks, setStarlinks] = useState([]);

  const handleAddStarlink = () => {
    setShowActivationModal(true);
  };

  const handleActivationSubmit = (code) => {
    console.log('Activation code:', code);
    setShowActivationModal(false);
    setShowDetailsModal(true);
  };

  const handleDetailsSubmit = (details) => {
    const newStarlink = {
      ...details,
      status: 'Online',
      id: Date.now(),
    };
    setStarlinks([...starlinks, newStarlink]);
    setShowDetailsModal(false);
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="account-section">
          <div className="form-group">
            <label htmlFor="currentAccount">Current Account</label>
            <select
              id="currentAccount"
              value={currentAccount}
              onChange={(e) => setCurrentAccount(e.target.value)}
              className="account-select"
              aria-labelledby="currentAccount"
            >
              <option value="Maritime">Maritime</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
        </div>

        <div className="starlinks-section">
          <div className="starlinks-header">
            <h2>Starlinks</h2>
            <div className="starlinks-actions">
              <button type="button" className="search-button">
                <i className="search-icon">🔍</i>
              </button>
              <button type="button" className="download-button">
                Download CSV
              </button>
            </div>
          </div>

          {starlinks.length === 0 ? (
            <div className="starlinks-content">
              <div className="no-starlinks">
                <p>No Offline Starlinks detected</p>
                <button type="button" className="add-starlink-button" onClick={handleAddStarlink}>
                  + Add Starlink
                </button>
              </div>
            </div>
          ) : (
            <div className="starlinks-table">
              <div className="table-header">
                <div className="header-cell">Name</div>
                <div className="header-cell">Service Line No.</div>
                <div className="header-cell">Status</div>
                <div className="header-cell">Actions</div>
              </div>
              {starlinks.map((starlink) => (
                <div key={starlink.id} className="table-row">
                  <div className="table-cell">{`${starlink.firstName} ${starlink.lastName}`}</div>
                  <div className="table-cell">{starlink.serviceLineNumber}</div>
                  <div className="table-cell">
                    <span className="status-badge online">Online</span>
                  </div>
                  <div className="table-cell">
                    <button type="button" className="manage-button">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showActivationModal && (
        <ActivationModal
          onClose={() => setShowActivationModal(false)}
          onActivate={handleActivationSubmit}
        />
      )}

      {showDetailsModal && (
        <StarlinkDetailsModal
          onClose={() => setShowDetailsModal(false)}
          onSubmit={handleDetailsSubmit}
        />
      )}
    </>
  );
};

export default Home;
