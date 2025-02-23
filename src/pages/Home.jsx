import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ActivationModal from '../components/ActivationModal';
import StarlinkDetailsModal from '../components/StarlinkDetailsModal';
import VerificationModal from '../components/VerificationModal';
import FundAccountModal from '../components/FundAccountModal';
import PaymentDetailsModal from '../components/PaymentDetailsModal';
import '../styles/Home.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createAxiosInstance } from '../config/axios';

const Home = () => {
  const [currentAccount, setCurrentAccount] = useState('Maritime');
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [starlinks, setStarlinks] = useState([]);
  const [filteredStarlinks, setFilteredStarlinks] = useState([]);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Verification states
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tempActivationData, setTempActivationData] = useState(null);
  const [userName, setUserName] = useState('John Doe');

  const [showFundAccountModal, setShowFundAccountModal] = useState(false);
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const checkVerificationFlow = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = localStorage.getItem('token');

      const { data } = await axiosInstance.get(
        `/api/v1/starlink_users/check_confirmation_status?id=${userData.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Confirmation status:', data);

      // Check email verification status
      if (!data.email_verified) {
        setShowEmailVerification(true);
        setShowPhoneVerification(false);
      } else if (!data.whatsapp_verified) {
        // If email is verified but WhatsApp isn't
        setShowEmailVerification(false);
        setShowPhoneVerification(true);
      } else {
        // Both are verified
        setShowEmailVerification(false);
        setShowPhoneVerification(false);
      }

      // Set user data
      setUserData(userData);
    } catch (error) {
      console.error('Error checking confirmation status:', error);
      toast.error('Failed to check verification status');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch confirmation status on component mount
  useEffect(() => {
    const initializeHome = async () => {
      setIsLoading(true);
      await checkVerificationFlow();
    };
    initializeHome();
  }, []);

  // Handle email verification request (when user clicks "Send Verification Link")
  const handleEmailVerification = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = localStorage.getItem('token');

      await axiosInstance.post(
        `/api/v1/email_confirmations?email=${userData.email}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success('Verification email sent! Please check your inbox.');
      setShowEmailVerification(false);
    } catch (error) {
      console.error('Error sending verification email:', error);
      toast.error('Failed to send verification email. Please try again.');
    }
  };

  // Handle WhatsApp verification code request
  const handleRequestWhatsAppCode = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = localStorage.getItem('token');

      await axiosInstance.post(
        `/api/v1/whatsapp_confirmations?id=${userData.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success('Verification code sent to your WhatsApp number!');
    } catch (error) {
      console.error('Error sending WhatsApp verification code:', error);
      toast.error('Failed to send verification code. Please try again.');
    }
  };

  // Handle WhatsApp verification
  const handlePhoneVerification = async (code) => {
    try {
      const axiosInstance = createAxiosInstance();
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = localStorage.getItem('token');

      const { data } = await axiosInstance.put(
        `/api/v1/whatsapp_confirmations/confirm_user_whatsapp?code=${code}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (data.success) {
        toast.success('WhatsApp number verified successfully!');
        setShowPhoneVerification(false);
        // Update local user data
        const updatedUserData = { ...userData, whatsapp_verified: true };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        // Refresh the confirmation status
        await checkVerificationFlow();
      } else {
        toast.error('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying WhatsApp number:', error);
      toast.error('Failed to verify WhatsApp number. Please try again.');
    }
  };

  const mapStatus = (status) => {
    const statusMap = {
      pending: { text: 'awaiting approval', class: 'awaiting-approval' },
      active: { text: 'online', class: 'online' },
      inactive: { text: 'offline', class: 'offline' },
      deactivated: { text: 'disconnected', class: 'disconnected' },
      expiring: { text: 'expiring soon', class: 'expiring-soon' }
    };
    return statusMap[status] || { text: status, class: status };
  };

  const shouldShowManageButton = (status) => {
    return status !== 'pending';
  };

  useEffect(() => {
    const fetchKits = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.id) return;

      const axiosInstance = createAxiosInstance();
      try {
        const { data } = await axiosInstance.get(`/api/v1/starlink_kits?user_id=${userData.id}`);
        console.log('Fetched Kits:', data);
        setStarlinks(data);
        setFilteredStarlinks(data);
      } catch (error) {
        console.error('Error fetching kits:', error);
        toast.error('Failed to fetch kits. Please try again.');
      }
    };

    fetchKits();
  }, []);

  useEffect(() => {
    let filtered = starlinks;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => mapStatus(item.status).class === statusFilter);
    }

    // Apply search query to both kit number and service line number
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        (item.kit_number && item.kit_number.toLowerCase().includes(query)) ||
        (item.service_line_number && item.service_line_number.toLowerCase().includes(query))
      );
    }

    setFilteredStarlinks(filtered);
  }, [searchQuery, statusFilter, starlinks]);

  const handlePhoneSubmit = (phoneNumber) => {
    // In a real app, this would send the verification code
    console.log('Sending verification code to:', phoneNumber);
    userData.whatsapp_number = phoneNumber;
  };

  const handleAddStarlink = () => {
    setShowActivationModal(true);
  };

  const handleActivationSubmit = (data) => {
    console.log('Activation code:', data);
    setShowActivationModal(false);
    setShowDetailsModal(true);
    // Store the activation data temporarily
    setTempActivationData(data);
  };

  const handleDetailsSubmit = (details) => {
    const newStarlink = {
      ...details,
      ...tempActivationData,
    };
    setStarlinks((prevStarlinks) => [...prevStarlinks, newStarlink]);
    setFilteredStarlinks((prevFiltered) => [...prevFiltered, newStarlink]);
    setShowDetailsModal(false);
    // Refresh the kits list after adding a new one
    const fetchKits = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.id) return;

      const axiosInstance = createAxiosInstance();
      try {
        const { data } = await axiosInstance.get(`/api/v1/starlink_kits?user_id=${userData.id}`);
        setStarlinks(data);
        setFilteredStarlinks(data);
      } catch (error) {
        console.error('Error fetching kits:', error);
      }
    };
    fetchKits();
  };

  const handleFundAccountSubmit = (details) => {
    setPaymentDetails(details);
    setShowFundAccountModal(false);
    setShowPaymentDetailsModal(true);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {showEmailVerification && (
        <VerificationModal
          type="email"
          email={userData?.email}
          onVerify={handleEmailVerification}
        />
      )}
      {showPhoneVerification && (
        <VerificationModal
          type="phone"
          phone={userData?.whatsapp_number}
          onVerify={handlePhoneVerification}
          onRequestCode={handleRequestWhatsAppCode}
        />
      )}
      <div className="home-container">
        <div className="welcome-section">
          <div className="welcome-header">
            <h1>
              Welcome back, {userName}! <span className="wave-emoji">👋</span>
            </h1>
            <div className="welcome-actions">
              <Link to="/profile" className="view-profile-button">
                View Profile
              </Link>
              <button 
                type="button" 
                className="fund-account-link"
                onClick={() => setShowFundAccountModal(true)}
              >
                Fund Account
              </button>
            </div>
          </div>
        </div>

        <div className="starlinks-section">
          <div className="starlinks-header">
            <h2>Starlinks</h2>
            <div className="starlinks-actions">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by Kit No. or Service Line No."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="starlinks-content">
            {filteredStarlinks.length === 0 ? (
              <div className="no-starlinks">
                <p>No Starlinks found</p>
              </div>
            ) : (
              <div className="starlinks-table">
                <div className="table-header">
                  <div className="header-cell">Kit Number</div>
                  <div className="header-cell">Service Line No.</div>
                  <div className="header-cell">Status</div>
                  <div className="header-cell">Actions</div>
                </div>
                {filteredStarlinks.map((starlink) => (
                  <div key={starlink.id} className="table-row">
                    <div className="table-cell">{starlink.kit_number}</div>
                    <div className="table-cell">{starlink.service_line_number || 'N/A'}</div>
                    <div className="table-cell">
                      <span className={`status-badge ${mapStatus(starlink.status).class}`}> 
                        {mapStatus(starlink.status).text.charAt(0).toUpperCase() + mapStatus(starlink.status).text.slice(1)}
                      </span>
                    </div>
                    <div className="table-cell">
                      {shouldShowManageButton(starlink.status) && (
                        <button type="button" className="manage-button">
                          Manage
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="add-starlink-section">
            <button type="button" className="add-starlink-button" onClick={handleAddStarlink}>
              + Add New Kit
            </button>
          </div>
        </div>
      </div>

      {showActivationModal && (
        <ActivationModal
          onClose={() => {
            localStorage.removeItem('tempKitNumber');
            setShowActivationModal(false);
          }}
          onActivate={handleActivationSubmit}
        />
      )}

      {showDetailsModal && (
        <StarlinkDetailsModal
          onClose={() => {
            localStorage.removeItem('tempKitNumber');
            setShowDetailsModal(false);
          }}
          onSubmit={handleDetailsSubmit}
        />
      )}

      {showFundAccountModal && (
        <FundAccountModal
          onClose={() => setShowFundAccountModal(false)}
          onSubmit={handleFundAccountSubmit}
        />
      )}

      {showPaymentDetailsModal && paymentDetails && (
        <PaymentDetailsModal
          onClose={() => setShowPaymentDetailsModal(false)}
          paymentDetails={paymentDetails}
        />
      )}
    </>
  );
};

export default Home;
