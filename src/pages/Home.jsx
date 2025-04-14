import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActivationModal from "../components/ActivationModal";
import StarlinkDetailsModal from "../components/StarlinkDetailsModal";
import VerificationModal from "../components/VerificationModal";
import FundAccountModal from "../components/FundAccountModal";
import PaymentDetailsModal from "../components/PaymentDetailsModal";
import AutoRenewToggle from "../components/AutoRenewToggle";
import "../styles/Home.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createAxiosInstance } from "../config/axios";
import Navbar from "../components/Navbar";
import WhatsAppButton from '../components/WhatsAppButton';

const Home = () => {
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [starlinks, setStarlinks] = useState([]);
  const [filteredStarlinks, setFilteredStarlinks] = useState([]);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Verification states
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tempActivationData, setTempActivationData] = useState(null);

  const [showFundAccountModal, setShowFundAccountModal] = useState(false);
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const [showInsufficientFundsModal, setShowInsufficientFundsModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState({ error: '', amountDue: '' });

  const [walletBalance, setWalletBalance] = useState(0);

  const navigate = useNavigate();

  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [activatingKitId, setActivatingKitId] = useState(null);

  useEffect(() => {
    const initializeHome = async () => {
      setIsLoading(true);

      await checkVerificationFlow();

      try {
        const axiosInstance = createAxiosInstance();
        const token = localStorage.getItem("token");

        const walletResponse = await axiosInstance.get(
          `/api/v1/starlink_user_wallet`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        localStorage.setItem("starlink_walletId", walletResponse.data.id);
      } catch (error) {
        console.error("Error fetching wallet:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeHome();
  }, []);

  const checkVerificationFlow = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = localStorage.getItem("token");

      const { data } = await axiosInstance.get(
        `/api/v1/starlink_users/check_confirmation_status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // this property to true

      // Check email verification status
      if (!data.email_verified) {
        setShowEmailVerification(true);
        setShowPhoneVerification(false);
      }
      //  else if (!data.whatsapp_verified) {
      //   // If email is verified but WhatsApp isn't
      //   setShowEmailVerification(false);
      //   setShowPhoneVerification(true);
      // } 
      
      else {
        // Both are verified
        setShowEmailVerification(false);
        setShowPhoneVerification(false);
      }

      // Set user data
      setUserData(userData);
    } catch (error) {
      console.error("Error checking confirmation status:", error);
      // toast.error("Failed to check verification status");
    }
  };

  const handleEmailVerification = async () => {

    try {
      const axiosInstance = createAxiosInstance();
      const token = localStorage.getItem("token");

      await axiosInstance.post(
        `/api/v1/email_confirmations`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error("Failed to send OTP.");
    }
  };

  const handleEmailCodeVerification = async (code) => {
  
    try {
      const axiosInstance = createAxiosInstance();
      const token = localStorage.getItem("token");

      const { data } = await axiosInstance.put(
        `/api/v1/email_confirmations/confirm_user_email?code=${String(code)}`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        toast.success("Email verified successfully!");
        setShowEmailVerification(false);

    } catch (error) {
      toast.error("Failed to verify code. Please try again.");
    }
  };

  // Handle WhatsApp verification code request
  const handleRequestWhatsAppCode = async () => {
    try {
      const axiosInstance = createAxiosInstance();
      const token = localStorage.getItem("token");

      await axiosInstance.post(
        `/api/v1/whatsapp_confirmations`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Verification code sent phone number via SMS!");
    } catch (error) {
      console.error("Error sending  verification code:", error);
      toast.error("Failed to send verification code. Please try again.");
    }
  };

  const handlePhoneVerification = async (code) => {
    try {
      const axiosInstance = createAxiosInstance();
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = localStorage.getItem("token");

      const { data } = await axiosInstance.put(
        `/api/v1/whatsapp_confirmations/confirm_user_whatsapp?code=${code}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("WhatsApp number verified successfully!");
        setShowPhoneVerification(false);

        const updatedUserData = { ...userData, whatsapp_verified: true };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        setUserData(updatedUserData);

        await checkVerificationFlow();
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying WhatsApp number:", error);
      toast.error("Failed to verify WhatsApp number. Please try again.");
    }
  };

  const mapStatus = (status) => {
    const statusMap = {
      pending: { text: "approved", class: "online" },
      active: { text: "online", class: "online" },
      accepted: { text: "approved", class: "online" },
      inactive: { text: "expired", class: "offline" },
      deactivated: { text: "disconnected", class: "disconnected" },
      expiring: { text: "expiring soon", class: "expiring-soon" },
    };
    return statusMap[status] || { text: status, class: status };
  };



  const handleActivateKit = async (kitId) => {
    setActivatingKitId(kitId);
    
    try {
      const axiosInstance = createAxiosInstance();
      const token = localStorage.getItem("token");
  
      await axiosInstance.post(
        `/api/v1/starlink_activates/${kitId}/activate_kit`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success("Activation successful!");
  
      // Update status to "active" for immediate UI update
      setStarlinks((prevStarlinks) =>
        prevStarlinks.map((starlink) =>
          starlink.id === kitId ? { ...starlink, status: "active" } : starlink
        )
      );
      
      // Also update in filtered starlinks
      setFilteredStarlinks((prevFiltered) =>
        prevFiltered.map((starlink) =>
          starlink.id === kitId ? { ...starlink, status: "active" } : starlink
        )
      );
    } catch (error) {
      console.error("Error activating kit:", error);
      
      if (error.response?.data?.amount_due) {
        setErrorDetails({
          error: error.response.data.error,
          amountDue: error.response.data.amount_due
        });
        setShowInsufficientFundsModal(true);
      } else {
        toast.error("Failed to activate kit. Please try again.");
      }
    } finally {
      // Reset activating state
      setActivatingKitId(null);
    }
  };

  const fetchKits = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.id) return;
  
    const axiosInstance = createAxiosInstance();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axiosInstance.get(`/api/v1/starlink_kits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Ensure data is always an array and has auto_renew property (default to false if not present)
      const processedData = Array.isArray(data) 
        ? data.map(kit => ({
            ...kit,
            auto_renew: kit.auto_renew || false
          })) 
        : [];
        
      setStarlinks(processedData);
      setFilteredStarlinks(processedData);
    } catch (error) {
      console.error("Error fetching kits:", error);
      setStarlinks([]);
      setFilteredStarlinks([]);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchKits();
  }, []);

  useEffect(() => {
    let filtered = starlinks;

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (item) => mapStatus(item.status).class === statusFilter
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.kit_number && item.kit_number.toLowerCase().includes(query)) ||
          (item.service_line_number &&
            item.service_line_number.toLowerCase().includes(query))
      );
    }

    setFilteredStarlinks(filtered);
  }, [searchQuery, statusFilter, starlinks]);

  const handleAddStarlink = () => {
    setShowActivationModal(true);
  };

  const handleActivationSubmit = (data) => {

    setShowActivationModal(false);
    setShowDetailsModal(true);
    // Store the activation data temporarily
    setTempActivationData(data);
  };

  const handleDetailsSubmit = async (details) => {
    // Close the modal first
    setShowDetailsModal(false);
    
    try {
      const axiosInstance = createAxiosInstance();
      const token = localStorage.getItem("token");
      const kitNumber = localStorage.getItem('tempKitNumber');
      
      // Make sure we have the activation data
      if (!tempActivationData) {
        toast.error("Missing activation data. Please try again.");
        return;
      }
      
      // Combine the data for submission
      const submissionData = {
        kit_number: kitNumber,
        address: details.address,
        nin: details.nin,
        company_name: details.company_name,
        company_number: details.company_number,
      };
      
      
      // Clear temp data immediately
      const activationDataCopy = {...tempActivationData};
      
      const response = await axiosInstance.post(
        "/api/v1/starlink_kits",
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("Starlink kit added successfully!");
      setTempActivationData(null);
      await fetchKits();
      
    } catch (error) {
      console.error("Error adding starlink kit:", error);
      toast.error("Failed to add Starlink kit. Please try again.");
    }
  };

  const handleFundAccountSubmit = (details) => {
    setPaymentDetails(details);
    setShowFundAccountModal(false);
    setShowPaymentDetailsModal(true);
  };

  const handleKitClick = (kit_number, kitId) => {
    navigate(`/dashboard/${kitId}`, {
      state: { kit_number },
    });
  };

  // This effect runs when shouldRefetch is set to true
  useEffect(() => {
    if (shouldRefetch) {
      fetchKits();
      // Reset the flag after fetching
      setShouldRefetch(false);
    }
  }, [shouldRefetch]);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const axiosInstance = createAxiosInstance();
        const token = localStorage.getItem("token");

        const walletResponse = await axiosInstance.get(
          `/api/v1/starlink_user_wallet`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWalletBalance(walletResponse.data.balance);
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };

    fetchWalletBalance();
  }, []);

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
          handleEmailCodeVerification={handleEmailCodeVerification}
        />
      )}
     {/* In Home.jsx, update the VerificationModal for phone verification like this: */}
{showPhoneVerification && (
  <VerificationModal
    type="phone"
    phone={userData?.phone_number}
    onVerify={() => {}} // Provide an empty function if not used directly
    handleRequestWhatsAppCode={handleRequestWhatsAppCode} // Pass the function as a prop
    handlePhoneVerification={handlePhoneVerification}
    onRequestCode={handleRequestWhatsAppCode} // Add this for the resend functionality
  />
)}
      <div className="home-container">
        <div className="welcome-section">
          <div className="welcome-header">
            <h1>
              Welcome back
              <span className="wave-emoji">👋</span>
            </h1>
            <p>{userData?.name}</p>


            <div className="wallet-balance">
              <h3 className="balance-text">Wallet Balance: 
                <br/>
                NGN {Number(walletBalance).toLocaleString()}</h3>
            </div>
          </div>
          <div className="welcome-actions">

            <button
              type="button"
              className="fund-account-link"
              onClick={() => setShowFundAccountModal(true)}
            >
              + Fund Wallet
            </button>
            <button
              type="button"
              className="fund-account-link"
              onClick={handleAddStarlink}
            >
              + Add New Kit
            </button>
          </div>
        </div>

        <div className="starlinks-section">
          <div className="starlinks-header">
            <h2>Added Kit(s)</h2>
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
                <option value="awaiting-approval">Awaiting Approval</option>
                <option value="disconnected">Disconnected</option>
                <option value="expiring-soon">Expiring Soon</option>
              </select>
            </div>
          </div>

          <div className="starlinks-content">
            <div className="starlinks-table">
              <div className="table-header">
                <div className="header-cell">Kit Number</div>
                <div className="header-cell">Service Line No.</div>
                <div className="header-cell">Status</div>
                <div className="header-cell">Actions</div>
                <div className="header-cell">Auto Renew</div>
              </div>
              {filteredStarlinks.length > 0 ? (
                filteredStarlinks.map((starlink) => (
                  <div key={starlink.id} className="starlink-card">
                    <div className="starlink-item">
                      <span className="label mobile-label">Kit Number:</span>
                      <span className="value kitno">{starlink.kit_number || "N/A"}</span>
                    </div>
                    
                    <div className="starlink-item">
                      <span className="label mobile-label">Service Line No.:</span>
                      <span className="value">{starlink.service_line_number || "N/A"}</span>
                    </div>
                    
                    <div className="starlink-item">
                      <span className="label mobile-label">Status:</span>
                      <span className={`status-badge ${mapStatus(starlink.status).class}`}>
                        {mapStatus(starlink.status).text}
                      </span>
                    </div>
                    
                    <div className="starlink-item">
                      <span className="label mobile-label">Actions:</span>
                      {starlink.status === "pending" ? (
                        <button
                          type="button"
                          className="activate-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivateKit(starlink.id);
                          }}
                          disabled={activatingKitId === starlink.id}
                        >
                          {activatingKitId === starlink.id ? "Activating..." : "Activate"}
                        </button>
                      ) : (
                        <button 
                          type="button" 
                          className="manage-button"
                          onClick={(e) => {
                            handleKitClick(starlink.kit_number, starlink.id)
                          }}
                        >
                          Manage
                        </button>
                      )}
                    </div>
                    
                    <div className="starlink-item">
                      <span className="label mobile-label">Auto Renew:</span>
                      <AutoRenewToggle 
                        kitId={starlink.id} 
                        initialStatus={starlink.auto_renew || false} 
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  No Starlinks found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showActivationModal && (
        <ActivationModal
          onClose={() => {
            localStorage.removeItem("tempKitNumber");
            setShowActivationModal(false);
          }}
          onActivate={handleActivationSubmit}
        />
      )}

      {showDetailsModal && (
        <StarlinkDetailsModal
          onClose={() => {
            localStorage.removeItem("tempKitNumber");
            setShowDetailsModal(false);
          }}
          onSubmit={handleDetailsSubmit}
        />
      )}

      {showFundAccountModal && (
        <FundAccountModal
          onClose={() => setShowFundAccountModal(false)}
          onSubmit={handleFundAccountSubmit}
          defaultAmount={paymentDetails?.defaultAmount}
        />
      )}

      {showPaymentDetailsModal && paymentDetails && (
        <PaymentDetailsModal
          onClose={() => setShowPaymentDetailsModal(false)}
          paymentDetails={paymentDetails}
        />
      )}

      {showInsufficientFundsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Insufficient Funds</h2>
              <button 
                className="close-button"
                onClick={() => setShowInsufficientFundsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>{errorDetails.error}. Amount due: NGN {Number(errorDetails.amountDue).toLocaleString()}</p>
              <div className="modal-actions">
                <button
                  className="fund-account-btn"
                  onClick={() => {
                    setShowInsufficientFundsModal(false);
                    setPaymentDetails({ defaultAmount: errorDetails.amountDue });
                    setShowFundAccountModal(true);
                  }}
                >
                  Fund Account
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setShowInsufficientFundsModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <WhatsAppButton />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default Home;