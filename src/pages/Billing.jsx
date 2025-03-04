"use client"

import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import "../styles/Billing.css"
import { createAxiosInstance } from "../config/axios"
import FundAccountModal from "../components/FundAccountModal"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye } from "react-icons/fa";
import WhatsAppButton from '../components/WhatsAppButton';


const Billing = () => {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [walletData, setWalletData] = useState(null)
  const [fundingHistory, setFundingHistory] = useState([])
  const [showFundAccountModal, setShowFundAccountModal] = useState(false)

  // Status mapping functions
  const mapStatus = (apiStatus) => {
    const statusMap = {
      pending: "unconfirmed",
      need_approval: "processing",
      expired: "expired",
      expiring: "expiring soon",
      approved: "successful",
      unapproved: "declined",
    }
    return statusMap[apiStatus] || apiStatus
  }

  const reverseMapStatus = (displayStatus) => {
    const reverseStatusMap = {
      unconfirmed: "pending",
      processing: "need_approval",
      expired: "expired",
      "expiring soon": "expiring",
      successful: "approved",
      declined: "unapproved",
    }
    return reverseStatusMap[displayStatus] || displayStatus
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const axiosInstance = createAxiosInstance()
        const token = localStorage.getItem("token")

        // Fetch funding history
        const fundingResponse = await axiosInstance.get(`/api/v1/starlink_wallet_fundings`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setFundingHistory(fundingResponse.data)
        console.log(fundingResponse)

        // Fetch wallet data
        const walletResponse = await axiosInstance.get(`/api/v1/starlink_user_wallet`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setWalletData(walletResponse.data)
        console.log(walletResponse)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to fetch billing data")
      }
    }

    fetchData()
  }, [])

  // Filter and paginate the history
  const filteredHistory = fundingHistory.filter(
    (item) => selectedStatus === "all" || item.status === reverseMapStatus(selectedStatus),
  )

  const paginatedHistory = filteredHistory.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handleFundAccountSubmit = (details) => {
    console.log("Fund account details:", details)
    setShowFundAccountModal(false)
  }

  // Reset to first page when filters or rows per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedStatus, rowsPerPage])

  const handleConfirmPayment = async (fundingId) => {
    try {
      const axiosInstance = createAxiosInstance();
      const token = localStorage.getItem("token");
      
      await axiosInstance.put(
        `/api/v1/starlink_wallet_fundings/confirm_request?id=${fundingId}`,
        {
          starlink_wallet_funding: {
            paid: "yes"
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Payment confirmed successfully!");
      
      // Refresh the funding history
      const fundingResponse = await axiosInstance.get(`/api/v1/starlink_wallet_fundings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFundingHistory(fundingResponse.data);
      
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Failed to confirm payment. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="billing-container">
        <div className="billing-header">
          <h1>Billing</h1>
          <p>Manage your invoices and payments.</p>
        </div>

        <div className="billing-content">
          <div className="billing-grid">
            <div className="billing-card">
              <div className="card-header">
                <h2>Balance</h2>
                <button type="button" className="pay-button" onClick={() => setShowFundAccountModal(true)}>
                  Fund Wallet
                </button>
              </div>
              <div className="amount-display">
                <span className="currency">NGN</span>
                <span className="amount">{walletData?.balance || "0.00"}</span>
              </div>
              <div className="warning-message">
                <FaEye style={{ marginRight: '4px' }} />
                Always keep your wallet funded with at least NGN 120,000
              </div>
            </div>

            <div className="billing-card">
              <div className="card-header">
                <h2>Wallet ID</h2>
              </div>
              <div className="amount-display">
                <span className="amount">{walletData?.wallet_id || "N/A"}</span>
              </div>
            </div>

            <div className="billing-card full-width">
              <div className="card-header">
                <h2>Transaction History</h2>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="status-filter"
                >
                  <option value="all">All Status</option>
                  <option value="unconfirmed">Unconfirmed</option>
                  <option value="processing">Processing</option>
                  <option value="successful">Successful</option>
                  <option value="declined">Declined</option>
                  <option value="expired">Expired</option>
                  <option value="expiring soon">Expiring Soon</option>
                </select>
              </div>

              <div className="table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Reference</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedHistory.map((item) => (
                      <tr key={item.id}>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                        <td>{item.reference}</td>
                        <td>NGN {Number(item.amount).toLocaleString()}</td>
                        <td className="status-cell">
                          <span className={`status-badge ${mapStatus(item.status)}`}>
                            {mapStatus(item.status)}
                          </span>
                          {item.status === 'pending' && mapStatus(item.status) === 'unconfirmed' && (
                            <button
                              className="confirm-btn"
                              onClick={() => handleConfirmPayment(item.id)}
                            >
                              Confirm
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {paginatedHistory.length === 0 && (
                      <tr>
                        <td colSpan={4} className="no-data">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="table-footer">
                <div className="rows-per-page">
                  Rows per page:
                  <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="rows-select"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>
                <div className="pagination">
                  <span>
                    {filteredHistory.length > 0
                      ? `${(currentPage - 1) * rowsPerPage + 1} - ${Math.min(
                          currentPage * rowsPerPage,
                          filteredHistory.length,
                        )} of ${filteredHistory.length}`
                      : "0 of 0"}
                  </span>
                  <button
                    type="button"
                    className="pagination-arrow"
                    aria-label="Previous page"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="pagination-arrow"
                    aria-label="Next page"
                    disabled={currentPage * rowsPerPage >= filteredHistory.length}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFundAccountModal && (
        <FundAccountModal onClose={() => setShowFundAccountModal(false)} onSubmit={handleFundAccountSubmit} />
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
      <WhatsAppButton />
    </>
  )
}

export default Billing

