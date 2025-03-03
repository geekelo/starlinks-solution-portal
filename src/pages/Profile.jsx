import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import { createAxiosInstance } from '../config/axios';
import '../styles/Profile.css';
import WhatsAppButton from '../components/WhatsAppButton';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')) || {});
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingWhatsApp, setIsEditingWhatsApp] = useState(false);
  const [email, setEmail] = useState(userData.email || '');
  const [phone, setPhone] = useState(userData.phone_number || '');
  const [whatsApp, setWhatsApp] = useState(userData.whatsapp_number || '');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const axiosInstance = createAxiosInstance();
      const token = localStorage.getItem('token');
      const response = await axiosInstance.put(
        `/api/v1/starlink_users/email_change_request`,
        {
          starlink_user_profile: {
            profile_param: email
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data) {
        const updatedUserData = { ...userData, email };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        toast.success('Email updated successfully!');
        setIsEditingEmail(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update email');
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    try {
      const axiosInstance = createAxiosInstance();
      const token = localStorage.getItem('token');
      const response = await axiosInstance.put(
        `/api/v1/starlink_users/phone_number_change_request`,
        {
          starlink_user_profile: {
            profile_param: phone
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data) {
        const updatedUserData = { ...userData, phone_number: phone };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        toast.success('Phone number updated successfully!');
        setIsEditingPhone(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update phone number');
    }
  };

  const handleWhatsAppSubmit = async (e) => {
    e.preventDefault();
    try {
      const axiosInstance = createAxiosInstance();
      const token = localStorage.getItem('token');
      const response = await axiosInstance.put(
        `/api/v1/starlink_users/whatsapp_number_change_request`,
        {
          starlink_user_profile: {
            profile_param: whatsApp
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data) {
        const updatedUserData = { ...userData, whatsapp_number: whatsApp };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        toast.success('WhatsApp number updated successfully!');
        setIsEditingWhatsApp(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update WhatsApp number');
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {userData.name?.charAt(0)}
          </div>
          <div className="profile-header-info">
            <h1>{userData.name}</h1>
          </div>
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
                <label>WhatsApp</label>
                <p>{whatsApp}</p>
                <button onClick={() => setIsEditingWhatsApp(true)} className="edit-button">Edit</button>
              </div>
              <div className="info-item">
                <label>Join Date</label>
                <p>{new Date(userData.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Account Actions</h2>
            <div className="action-buttons">
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
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
              <h2>Edit Phone Number</h2>
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

      {isEditingWhatsApp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit WhatsApp Number</h2>
              <button type="button" className="close-button" onClick={() => setIsEditingWhatsApp(false)}>×</button>
            </div>
            <form onSubmit={handleWhatsAppSubmit}>
              <div className="form-group">
                <label htmlFor="whatsapp">New WhatsApp Number</label>
                <input
                  type="tel"
                  id="whatsapp"
                  value={whatsApp}
                  onChange={(e) => setWhatsApp(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setIsEditingWhatsApp(false)}>Cancel</button>
                <button type="submit" className="submit-button">Save</button>
              </div>
            </form>
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
      <WhatsAppButton />
    </>
  );
};

export default Profile; 