"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { createAxiosInstance } from "../config/axios"
import Navbar from "../components/Navbar"
import "../styles/Dashboard.css"
import FundAccountModal from "../components/FundAccountModal"
import { Link } from "react-router-dom"
import { FaLink } from "react-icons/fa"
import WhatsAppButton from "../components/WhatsAppButton"
import BackButton from '../components/BackButton'

const Dashboard = () => {
  const { kitId } = useParams()
  const navigate = useNavigate()
  const [kitData, setKitData] = useState(null)
  const [newAddress, setNewAddress] = useState("")

  const [selectedPeriod, setSelectedPeriod] = useState("Feb - Mar")
  const [graphData, setGraphData] = useState({
    date: "17 Feb",
    priorityUsage: 7.99,
    throttledUsage: 0,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [isEditingAddress, setIsEditingAddress] = useState(false)

  const [renewalHistory, setRenewalHistory] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("all")

  const [activeTab, setActiveTab] = useState("invoices")

  const [expirationDate, setExpirationDate] = useState(new Date())
  const [currentDate] = useState(new Date())
  const [isRenewButtonEnabled, setIsRenewButtonEnabled] = useState(false)

  const [showFundAccountModal, setShowFundAccountModal] = useState(false)

  const mapStatus = (apiStatus) => {
    const statusMap = {
      pending: "unconfirmed",
      need_approval: "processing",
      expired: "expired",
      expiring: "expiring soon",
      accepted: "approved",
      unapproved: "declined",
      invoice: "invoice",
      receipt: "receipt",
    }
    return statusMap[apiStatus] || apiStatus
  }

  const fetchKitDetails = useCallback(async () => {
    const axiosInstance = createAxiosInstance()
    const token = localStorage.getItem("token")
    try {
      const response = await axiosInstance.get(`/api/v1/starlink_kits/${kitId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setKitData(response.data.kit)
      setNewAddress(response.data.kit.address)
    } catch (error) {
      console.error("Error fetching kit details:", error)
      toast.error("Failed to fetch kit details.")
    }
  }, [kitId])

  const fetchRenewalHistory = useCallback(async () => {
    const axiosInstance = createAxiosInstance()
    const token = localStorage.getItem("token")
    try {
      const response = await axiosInstance.get(`/api/v1/starlink_kit_renewals/user_kit_renewals?kit_id=${kitId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setRenewalHistory(response.data || [])

      if (response.data.length > 0) {
        const lastRenewal = response.data[response.data.length - 1]
        setExpirationDate(new Date(lastRenewal.deadline))
      }
    } catch (error) {
      console.error("Error fetching renewal history:", error)
      toast.error("Failed to fetch renewal history.")
    }
  }, [kitId])

  useEffect(() => {
    if (kitId) {
      fetchKitDetails()
    }
  }, [kitId, fetchKitDetails])

  useEffect(() => {
    if (kitId) {
      fetchRenewalHistory()
    }
  }, [kitId, fetchRenewalHistory])

  useEffect(() => {
    // Simulating real-time data updates
    const updateInterval = setInterval(() => {
      const newPriorityUsage = Math.min(8, Math.max(0, graphData.priorityUsage + (Math.random() - 0.5) * 0.5))
      const newThrottledUsage = Math.min(8, Math.max(0, graphData.throttledUsage + (Math.random() - 0.5) * 0.2))
      setGraphData({
        date: graphData.date,
        priorityUsage: Number(newPriorityUsage.toFixed(2)),
        throttledUsage: Number(newThrottledUsage.toFixed(2)),
      })
    }, 5000) // Updates every 5 seconds

    return () => clearInterval(updateInterval)
  }, [graphData])

  useEffect(() => {
    setCurrentPage(1)
  }, [])

  useEffect(() => {
    // Check if the expiration date is within 7 days from the current date
    const daysUntilExpiration = (expirationDate - currentDate) / (1000 * 60 * 60 * 24)
    setIsRenewButtonEnabled(daysUntilExpiration <= 7)
  }, [expirationDate, currentDate])

  const handleAddressChange = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    const axiosInstance = createAxiosInstance()
    try {
      await axiosInstance.put(
        `/api/v1/starlink_kits/kit_address_change_request?id=${kitId}`,
        {
          starlink_kit_address: {
            address: newAddress,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      toast.success("Address updated successfully!")
      fetchKitDetails() // Refresh the kit data
      setIsEditingAddress(false) // Close the modal
    } catch (error) {
      console.error("Error updating address:", error)
      toast.error("Failed to update address.")
    }
  }

  const handleDownloadPDF = async (renewalId) => {
    try {
      const axiosInstance = createAxiosInstance()
      const token = localStorage.getItem("token")

      const response = await axiosInstance.get(`/api/v1/starlink_kit_renewals/${renewalId}/download_pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Important for handling PDF data
      })

      // Create a blob from the PDF data
      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)

      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `renewal-${renewalId}.pdf`)
      document.body.appendChild(link)
      link.click()

      // Cleanup
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success("PDF downloaded successfully!")
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast.error("Failed to download PDF. Please try again.")
    }
  }

  const handleRenew = async () => {
    const axiosInstance = createAxiosInstance()
    const token = localStorage.getItem("token")

    try {
      const response = await axiosInstance.post(
        `/api/v1/starlink_activates/${kitId}/activate_kit`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      toast.success("Renewal successful!")
      // Handle any additional logic after successful renewal
    } catch (error) {
      console.error("Error renewing kit:", error)
      if (error.response.data.amount_due) {
        setShowFundAccountModal(true) // Show the fund account modal
      } else {
        toast.error("Failed to renew kit. Please try again.")
      }
    }
  }

  return (
    <>
      <BackButton />
      <Navbar />
      <div className="dashboard-container">
        <button onClick={() => navigate(-1)} className="back-button">
          Back
        </button>
        <div className="page-header">
          <div className="header-navigation">
            <h1>{kitData?.company_name || "Loading..."}</h1>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="left-panel">
            <div className="panel-header">
              <h2>{kitData?.company_name || "Loading..."}</h2>
              <button type="button" className="edit-button" aria-label="Edit" onClick={() => setIsEditingAddress(true)}>
                Edit
              </button>
            </div>
            <div className="info-section">
              <h3>Address</h3>
              <p>{kitData?.address || "Loading..."}</p>
              <h3>Kit Number</h3>
              <p>{kitData?.kit_number || "Loading..."}</p>

              <h3>Company Number</h3>
              <p>{kitData?.company_number || "N/A"}</p>

              <h3>Status</h3>
              <p>{mapStatus(kitData?.status) || "Loading..."}</p>

              <h3>Service Line Number</h3>
              <p>{kitData?.service_line_number || "N/A"}</p>
            </div>
          </div>

          <div className="center-panel">
            <div className="usage-section">
              <div className="upcoming-update-notice">
                <p>Upcoming Update: Real-time usage graph will be implemented soon.</p>
              </div>
              <div className="usage-header">
                <div className="usage-titles">
                  <div className="usage-title">
                    <h2>
                      Total Priority Usage:
                      <div className="usage-value">
                        <span className="value">{graphData.priorityUsage}</span>
                        <span className="unit">GB</span>
                      </div>
                    </h2>
                  </div>
                  <div className="usage-title">
                    <h2>
                      Total Throttled Usage:
                      <div className="usage-value">
                        <span className="value">{graphData.throttledUsage}</span>
                        <span className="unit">GB</span>
                      </div>
                    </h2>
                  </div>
                </div>
                <div className="period-actions">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="period-select"
                    aria-label="Select Period"
                  >
                    <option value="Feb - Mar">Feb - Mar</option>
                    <option value="Jan - Feb">Jan - Feb</option>
                  </select>
                  <button type="button" className="download-button" aria-label="Download Data">
                    Download
                  </button>
                </div>
              </div>

              <div className="usage-graph">
                <div className="y-axis">
                  <span>8 GB</span>
                  <span>6 GB</span>
                  <span>4 GB</span>
                  <span>2 GB</span>
                  <span>0 GB</span>
                </div>
                <div className="graph-content">
                  <div className="graph-line">
                    <div
                      className="data-point"
                      style={{
                        height: `${(graphData.priorityUsage / 8) * 100}%`,
                        transition: "height 0.3s ease-in-out",
                      }}
                      data-value={`${graphData.priorityUsage} GB`}
                      role="img"
                      aria-label={`Priority Usage: ${graphData.priorityUsage} GB`}
                    />
                  </div>
                  <div className="x-axis">{graphData.date}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="starlink-info-footer">
          <div className="account-history-header">
            <h2>Kit Subscription Details</h2>
          </div>
          <div className="info-row">
            <div className="info-item">
              <div className="info-label">Billing period</div>
              <div className="info-value">
                Your current subscription expires{" "}
                <span className="expiration-date">{expirationDate.toLocaleDateString()}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Status</div>
              <div className="info-value">
                <span className="status-badge offline">{mapStatus(kitData?.status) || "Loading..."}</span>
                <button
                  className="renew-button"
                  disabled={!isRenewButtonEnabled}
                  onClick={isRenewButtonEnabled ? handleRenew : null}
                >
                  {kitData?.status === "deactivated" ? "Reactivate" : "Renew"}
                </button>
                <div className="warning-message">
                  The renew button is enabled only when there are 7 days left until the billing period.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="renewal-history-section">
          <div className="card-header">
            <h2>Renewal History</h2>
            <div className="tabs">
              <button
                className={`tab ${activeTab === "invoices" ? "active" : ""}`}
                onClick={() => setActiveTab("invoices")}
              >
                Next Payment
              </button>
              <button
                className={`tab ${activeTab === "receipts" ? "active" : ""}`}
                onClick={() => setActiveTab("receipts")}
              >
                Receipts
              </button>
            </div>
          </div>

          <div className="table-container">
            <div className="warning-text">
              Please ensure you have sufficient wallet balance before renewing your kit to avoid any interruptions.
              <Link to="/billing" className="billing-link">
                Fund your wallet <FaLink style={{ marginLeft: "4px" }} />
              </Link>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>{activeTab === "receipts" ? "Date of Renewal" : "Deadline"}</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Download</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {renewalHistory
                  .filter((item) => {
                    if (activeTab === "invoices") {
                      return item.status === "invoice"
                    } else {
                      return item.status === "receipt"
                    }
                  })
                  .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                  .map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="mobile-label">Amount:</div>
                        NGN {Number(item.amount).toLocaleString()}
                      </td>
                      <td>
                        <div className="mobile-label">{activeTab === "receipts" ? "Date of Renewal" : "Deadline"}:</div>
                        <span className={`status-badge ${activeTab === "receipts" ? "online" : "offline"}`}>
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <div className="mobile-label">Month:</div>
                        {new Date(item.created_at).toLocaleString("default", { month: "long" })}
                      </td>
                      <td>
                        <div className="mobile-label">Year:</div>
                        {new Date(item.created_at).getFullYear()}
                      </td>
                      <td>
                        <div className="mobile-label">Download:</div>
                        <button className="action-button" onClick={() => handleDownloadPDF(item.id)}>
                          Download PDF
                        </button>
                      </td>
                      <td>
                        <div className="mobile-label">Duration:</div>
                        {item.start_date || "Start Date"} - {item.end_date || "End Date"}
                      </td>
                    </tr>
                  ))}
                {renewalHistory.length === 0 && (
                  <tr>
                    <td colSpan={6} className="no-data">
                      No {activeTab} found
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
                {renewalHistory.length > 0
                  ? `${(currentPage - 1) * rowsPerPage + 1} - ${Math.min(
                      currentPage * rowsPerPage,
                      renewalHistory.length,
                    )} of ${renewalHistory.length}`
                  : "0 of 0"}
              </span>
              <button
                type="button"
                className="pagination-arrow"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                ‹
              </button>
              <button
                type="button"
                className="pagination-arrow"
                disabled={currentPage * rowsPerPage >= renewalHistory.length}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {isEditingAddress && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit Kit Address</h2>
                <button type="button" className="close-button" onClick={() => setIsEditingAddress(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleAddressChange}>
                <div className="form-group">
                  <label htmlFor="kitAddress">New Kit Address</label>
                  <input
                    type="text"
                    id="kitAddress"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="cancel-button" onClick={() => setIsEditingAddress(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {showFundAccountModal && <FundAccountModal onClose={() => setShowFundAccountModal(false)} />}
      <WhatsAppButton />
    </>
  )
}

export default Dashboard

