"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { createAxiosInstance } from "../config/axios";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { kitId } = useParams();
  const location = useLocation();
  const kitNumber = location.state?.kit_number;
  const [kitData, setKitData] = useState(null);
  const [newAddress, setNewAddress] = useState("");

  const [selectedPeriod, setSelectedPeriod] = useState("Feb - Mar");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [graphData, setGraphData] = useState({
    date: "17 Feb",
    priorityUsage: 7.99,
    throttledUsage: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const historyData = [
    {
      date: "9/9/2024",
      dueDate: "9/9/2024",
      description: "Subscription",
      invoiceNumber: "INV-NGA-568926-9",
      method: "Credit Card",
      total: "NGN 38,000.00",
      balanceDue: "NGN 38,000.00",
      status: "overdue",
    },
    {
      date: "8/8/2024",
      dueDate: "8/8/2024",
      description: "Subscription",
      invoiceNumber: "INV-NGA-495513-3",
      method: "Credit Card",
      total: "NGN 38,000.00",
      balanceDue: "NGN 0.00",
      status: "paid",
    },
  ];

  const fetchKitData = useCallback(async () => {
    const axiosInstance = createAxiosInstance();
    const token = localStorage.getItem("token");
    try {
      const { data } = await axiosInstance.get(
        `/api/v1/starlink_kits/${kitId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Fetched Kit Data:", data);
      setKitData(data.kit);
      setNewAddress(data.kit.address);
    } catch (error) {
      console.error("Error fetching kit:", error);
      toast.error("Failed to fetch kit data.");
    }
  }, [kitId]);

  useEffect(() => {
    if (kitId) {
      fetchKitData();
    }
  }, [kitId, fetchKitData]);

  useEffect(() => {
    // Simulating real-time data updates
    const updateInterval = setInterval(() => {
      const newPriorityUsage = Math.min(
        8,
        Math.max(0, graphData.priorityUsage + (Math.random() - 0.5) * 0.5)
      );
      const newThrottledUsage = Math.min(
        8,
        Math.max(0, graphData.throttledUsage + (Math.random() - 0.5) * 0.2)
      );
      setGraphData({
        date: graphData.date,
        priorityUsage: Number(newPriorityUsage.toFixed(2)),
        throttledUsage: Number(newThrottledUsage.toFixed(2)),
      });
    }, 5000); // Updates every 5 seconds

    return () => clearInterval(updateInterval);
  }, [graphData]);

  const handleAddressChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const axiosInstance = createAxiosInstance();
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
        }
      );
      toast.success("Address updated successfully!");
      fetchKitData(); // Refresh the kit data
      setIsEditingAddress(false); // Close the modal
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="page-header">
          <div className="header-navigation">
            <button type="button" className="nav-arrow" aria-label="Previous">
              ‹
            </button>
            <h1>{kitData?.company_name || "Loading..."}</h1>
            <button type="button" className="nav-arrow" aria-label="Next">
              ›
            </button>
          </div>
          <button
            type="button"
            className="settings-button"
            aria-label="Settings"
          >
            Settings
            <span className="settings-icon" aria-hidden="true">
              ⚙️
            </span>
          </button>
        </div>

        <div className="dashboard-content">
          <div className="left-panel">
            <div className="panel-header">
              <h2>{kitData?.company_name || "Loading..."}</h2>
              <button
                type="button"
                className="edit-button"
                aria-label="Edit"
                onClick={() => setIsEditingAddress(true)}
              >
                Edit
              </button>
            </div>
            <div className="info-section">
              <h3>Address</h3>
              <p>{kitData?.address || "Loading..."}</p>
              <h3>Kit Number</h3>
              <p>{kitData?.kit_number || "Loading..."}</p>

              <h3>NIN</h3>
              <p>{kitData?.nin || "Loading..."}</p>

              <h3>Company Number</h3>
              <p>{kitData?.company_number || "N/A"}</p>

              <h3>Status</h3>
              <p>{kitData?.status || "Loading..."}</p>

              <h3>Service Line Number</h3>
              <p>{kitData?.service_line_number || "N/A"}</p>
            </div>
          </div>

          <div className="center-panel">
            <div className="usage-section">
              <div className="upcoming-update-notice">
                <p>
                  Upcoming Update: Real-time usage graph will be implemented
                  soon.
                </p>
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
                        <span className="value">
                          {graphData.throttledUsage}
                        </span>
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
                  <button
                    type="button"
                    className="download-button"
                    aria-label="Download Data"
                  >
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
                  <div className="graph-legend">
                    <div className="legend-item">
                      <span
                        className="legend-color priority"
                        aria-hidden="true"
                      />
                      <span>Priority Data Usage</span>
                    </div>
                    <div className="legend-item">
                      <span
                        className="legend-color throttled"
                        aria-hidden="true"
                      />
                      <span>Throttled Data Usage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="starlink-info-footer">
        <div className="account-history-header">
        <h2>KIt Details</h2></div>
          <div className="info-row">
            <div className="info-item">
              <div className="info-label">Billing period</div>
              <div className="info-value">
                Your billing period is January 18 - February 17. Payment due
                January 18.
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">YOur wallet Id</div>
              <div className="info-value">9876543212134</div>
            </div>
            <div className="info-item">
              <div className="info-label">Kit Number</div>
              <div className="info-value">
                {kitData?.kit_number || "Loading..."}
              </div>
            </div>
          </div>
        </div>

        <div className="account-history">
          <div className="account-history-header">
            <h2>Account History</h2>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="year-filter"
              aria-label="Filter by year"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Due Date</th>
                <th>Description</th>
                <th>Invoice Number</th>
                <th>Method</th>
                <th>Total</th>
                <th>Balance Due</th>
                <th>Status</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr key={item.invoiceNumber}>
                  <td>{item.date}</td>
                  <td>{item.dueDate}</td>
                  <td>{item.description}</td>
                  <td>{item.invoiceNumber}</td>
                  <td>{item.method}</td>
                  <td>{item.total}</td>
                  <td>{item.balanceDue}</td>
                  <td>
                    <span className={`status-badge ${item.status}`}>
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="download-icon"
                      aria-label="Download invoice"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-footer">
            <div className="rows-per-page">
              Rows per page:
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="year-filter"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="pagination">
              <span>1-2 of 2</span>
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
                disabled={currentPage * rowsPerPage >= historyData.length}
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
                <button
                  type="button"
                  className="close-button"
                  onClick={() => setIsEditingAddress(false)}
                >
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
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsEditingAddress(false)}
                  >
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
    </>
  );
};

export default Dashboard;
