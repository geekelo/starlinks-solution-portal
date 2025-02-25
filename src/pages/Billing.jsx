import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/Billing.css';
import { useEffect } from 'react';
import { createAxiosInstance } from '../config/axios';

const Billing = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Feb - Mar');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedYear, setSelectedYear] = useState("2024");


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

  useEffect(() => {
      const fetchFunding = async () => {

        try {
          const axiosInstance = createAxiosInstance();
          const token = localStorage.getItem("token");
    
          const fundingResponse = await axiosInstance.get(
            `/api/v1/starlink_wallet_fundings`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(fundingResponse)
  
        } catch (error) {
          console.error("Error fetching fundings:", error);
        }
        
      };
  
      fetchFunding();
    }, []);
  

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
                <h2>Balance Due</h2>
                <button type="button" className="pay-button">Pay</button>
              </div>
              <div className="amount-display">
                <span className="currency">NGN</span>
                <span className="amount">0.00</span>
                <span className="check-icon">✓</span>
              </div>
            </div>

            <div className="billing-card">
              <div className="card-header">
                <h2>Available Service Credits</h2>
                <button type="button" className="info-button" aria-label="Information">ⓘ</button>
              </div>
              <div className="amount-display">
                <span className="currency">NGN</span>
                <span className="amount">159,000.00</span>
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
          </div>
          
        </div>
        
      </div>
    </>
  );
};

export default Billing;
