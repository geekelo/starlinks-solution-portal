import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ActivationModal from "../components/ActivationModal";
import StarlinkDetailsModal from "../components/StarlinkDetailsModal";
import VerificationModal from "../components/VerificationModal";
import FundAccountModal from "../components/FundAccountModal";
import PaymentDetailsModal from "../components/PaymentDetailsModal";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createAxiosInstance } from "../config/axios";
import Navbar from "../components/Navbar";

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

  const location = useLocation();
  const navigate = useNavigate();

  const [shouldRefetch, setShouldRefetch] = useState(false);

  useEffect(() => {
    const initializeHome = async () => {
      setIsLoading(true);
      const params = new URLSearchParams(location.search);
      const emailToken = params.get("token");

      if (emailToken) {
        try {
          const axiosInstance = createAxiosInstance();
          const token = localStorage.getItem("token");
          await axiosInstance.put(
            `/api/v1/email_confirmations/confirm_user_email?token=${emailToken}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast.success("Email confirmed successfully!");
          // Skip the email verification modal since we just confirmed it
          setShowEmailVerification(false);
        } catch (error) {
          toast.error("Failed to confirm email.");
        }
      }
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
  }, [location.search]);

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

      console.log("Confirmation status:", data);

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
      console.error("Error checking confirmation status:", error);
      toast.error("Failed to check verification status");
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

      toast.success("Verification email sent! Please check your inbox.");
      setShowEmailVerification(true);
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error("Failed to send verification email. Please try again.");
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

      toast.success("Verification code sent to your WhatsApp number!");
    } catch (error) {
      console.error("Error sending WhatsApp verification code:", error);
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
      pending: { text: "awaiting approval", class: "awaiting-approval" },
      active: { text: "online", class: "online" },
      accepted: { text: "approved", class: "online" },
      inactive: { text: "expired", class: "offline" },
      deactivated: { text: "disconnected", class: "disconnected" },
      expiring: { text: "expiring soon", class: "expiring-soon" },
    };
    return statusMap[status] || { text: status, class: status };
  };

  const shouldShowManageButton = (status) => {
    return status !== "pending";
  };

  const handleActivateKit = async (kitId) => {
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

      setStarlinks((prevStarlinks) =>
        prevStarlinks.map((starlink) =>
          starlink.id === kitId ? { ...starlink, status: "approved" } : starlink
        )
      );
    } catch (error) {
      console.error("Error activating kit:", error);
      
      if (error.response.data.amount_due) {
        setErrorDetails({
          error: error.response.data.error,
          amountDue: error.response.data.amount_due
        });
        setShowInsufficientFundsModal(true);
      } else {
        toast.error("Failed to activate kit. Please try again.");
      }
    }
  };

  const fetchKits = async () => {
    console.log("Fetching kits...");
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

      console.log("Fetched Kits:", data);

      // Ensure data is always an array
      setStarlinks(Array.isArray(data) ? data : []);
      setFilteredStarlinks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching kits:", error);
      toast.error("Failed to fetch kits. Please try again.");
      setStarlinks([]); // Set empty array on error
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
    console.log("Activation code:", data);
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
      
      console.log("Temp activation data:", tempActivationData);
      console.log("Details data:", details);
      
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
      
      console.log("Submitting combined data:", submissionData);
      
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
      
      console.log("API response:", response);
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
    console.log("Navigating to kit:", { kit_number, kitId });
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
              Welcome back, {userData?.name}!{" "}
              <span className="wave-emoji">👋</span>
            </h1>
          </div>
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
                <option value="awaiting-approval">Awaiting Approval</option>
                <option value="disconnected">Disconnected</option>
                <option value="expiring-soon">Expiring Soon</option>
              </select>
            </div>
          </div>

          <div className="starlinks-content">
            <div className="table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th className="table-header">Kit Number</th>
                    <th className="table-header">Service Line No.</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStarlinks.map((starlink) => (
                    <tr key={starlink.id}>
                      <td className="table-cell">{starlink.kit_number || "N/A"}</td>
                      <td className="table-cell">{starlink.service_line_number || "N/A"}</td>
                      <td className="table-cell">
                        <span className={`status-badge ${mapStatus(starlink.status).class}`}>
                          {mapStatus(starlink.status).text}
                        </span>
                      </td>
                      <td className="table-cell">
                        {starlink.status === "accepted" ? (
                          <button
                            type="button"
                            className="manage-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActivateKit(starlink.id);
                            }}
                          >
                            Activate
                          </button>
                        ) : shouldShowManageButton(starlink.status) ? (
                          <button
                            type="button"
                            className="manage-button"
                            onClick={() => handleKitClick(starlink.kit_number, starlink.id)}
                          >
                            Manage
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                  {filteredStarlinks.length === 0 && (
                    <tr>
                      <td colSpan={4} className="table-cell no-data">
                        No Starlinks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="add-starlink-section">
            <button
              type="button"
              className="add-starlink-button"
              onClick={handleAddStarlink}
            >
              + Add New Kit
            </button>
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