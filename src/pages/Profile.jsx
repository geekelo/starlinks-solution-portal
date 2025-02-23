import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/Profile.css';

const Profile = () => {
  // This would come from your auth system
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    role: 'Administrator',
    joinDate: 'January 2024',
    accountType: 'Maritime',
    totalKits: 3,
    activeKits: 2
  };

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [email, setEmail] = useState(userData.email);
  const [phone, setPhone] = useState(userData.phone);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the API call to update the email
    console.log('Updated Email:', email);
    setIsEditingEmail(false);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the API call to update the phone
    console.log('Updated Phone:', phone);
    setIsEditingPhone(false);
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {userData.name.charAt(0)}
          </div>
          <h1>{userData.name}</h1>
          <p className="profile-role">{userData.role}</p>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Email</label>
                <p>{email}</p>
                <button onClick={() => setIsEditingEmail(true)} className="edit-button">Edit</button>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{phone}</p>
                <button onClick={() => setIsEditingPhone(true)} className="edit-button">Edit</button>
              </div>
              <div className="info-item">
                <label>Join Date</label>
                <p>{userData.joinDate}</p>
              </div>
              <div className="info-item">
                <label>Account Type</label>
                <p>{userData.accountType}</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Account Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Kits</h3>
                <p>{userData.totalKits}</p>
              </div>
              <div className="stat-card">
                <h3>Active Kits</h3>
                <p>{userData.activeKits}</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Account Actions</h2>
            <div className="action-buttons">
              <button className="edit-profile-btn">Edit Profile</button>
              <button className="change-password-btn">Change Password</button>
            </div>
          </div>
        </div>
      </div>

      {isEditingEmail && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Email</h2>
              <button type="button" className="close-button" onClick={() => setIsEditingEmail(false)}>×</button>
            </div>
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label htmlFor="email">New Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setIsEditingEmail(false)}>Cancel</button>
                <button type="submit" className="submit-button">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditingPhone && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Phone</h2>
              <button type="button" className="close-button" onClick={() => setIsEditingPhone(false)}>×</button>
            </div>
            <form onSubmit={handlePhoneSubmit}>
              <div className="form-group">
                <label htmlFor="phone">New Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setIsEditingPhone(false)}>Cancel</button>
                <button type="submit" className="submit-button">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile; 