import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createAxiosInstance } from '../config/axios';
import '../styles/SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    starlink_user: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      confirm_password: '',
      whatsappNumber: '',
      phoneNumber: '',
      countryCode: '+234',
      whatsappCountryCode: '+234',
    }
  });
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  const isLoggedIn = !!localStorage.getItem('token');

  // If logged in, redirect to home
  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      starlink_user: {
        ...prevState.starlink_user,
        [name]: value
      }
    }));
  };

  const handleCountryCodeChange = (e, type) => {
    const field = type === 'whatsapp' ? 'whatsappCountryCode' : 'countryCode';
    setFormData(prevState => ({
      ...prevState,
      starlink_user: {
        ...prevState.starlink_user,
        [field]: e.target.value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.starlink_user.password !== formData.starlink_user.confirm_password) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    // Check if WhatsApp number starts with 0 and remove it
    const whatsappNumber = formData.starlink_user.whatsappNumber.startsWith('0') 
      ? formData.starlink_user.whatsappNumber.slice(1) 
      : formData.starlink_user.whatsappNumber;

    // Check if Phone number starts with 0 and remove it
    const phoneNumber = formData.starlink_user.phoneNumber.startsWith('0') 
      ? formData.starlink_user.phoneNumber.slice(1) 
      : formData.starlink_user.phoneNumber;

    try {
      const axiosInstance = createAxiosInstance();
      const fullName = `${formData.starlink_user.firstName} ${formData.starlink_user.middleName} ${formData.starlink_user.lastName}`.trim();
      const formattedWhatsappNumber = `${formData.starlink_user.whatsappCountryCode}${whatsappNumber}`;
      const formattedPhoneNumber = `${formData.starlink_user.countryCode}${phoneNumber}`;

      // Signup
      await axiosInstance.post('/api/v1/signup', {
        starlink_user: {
          email: formData.starlink_user.email,
          password: formData.starlink_user.password,
          phone_number: formattedPhoneNumber,
          name: fullName,
          whatsapp_number: formattedWhatsappNumber,
          confirm_password: formData.starlink_user.confirm_password,
        }
      });

      // Immediately login after successful signup
      const { data } = await axiosInstance.post('/api/v1/login', {
        starlink_user: {
          email: formData.starlink_user.email,
          password: formData.starlink_user.password
        }
      });

      // Store user data and token
      localStorage.setItem('userData', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      toast.success('Sign up and login successful!');
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const countryCodes = [
    { code: '+234', country: 'NG' },
    { code: '+1', country: 'US' },
    { code: '+44', country: 'GB' },
    { code: '+91', country: 'IN' },
    { code: '+86', country: 'CN' },
    { code: '+27', country: 'ZA' },
    { code: '+254', country: 'KE' },
    { code: '+255', country: 'TZ' },
    { code: '+256', country: 'UG' },
    { code: '+251', country: 'ET' },
  ];

  return (
    <>
      <div className="signup-container">
        <div className="signup-form-section">
          <div className="signup-content">
            <div className="signup-header">
              <h1>Sign Up</h1>
              <p>Create your Starlink account</p>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="name-fields">
                <div className="form-group">
                  <label htmlFor="firstName" className="signup-labels">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.starlink_user.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="middleName" className="signup-labels">Middle Name</label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.starlink_user.middleName}
                    onChange={handleChange}
                    placeholder="Middle Name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="signup-labels">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.starlink_user.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="signup-labels">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.starlink_user.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="signup-labels">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.starlink_user.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="signup-labels">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirm_password"
                  value={formData.starlink_user.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
              </div>

              <div className="form-group phone-input-group">
                <label htmlFor="confirmPassword" className="signup-labels">WhatsApp Number</label>
                <select
                  className="country-code"
                  value={formData.starlink_user.whatsappCountryCode}
                  onChange={(e) => handleCountryCodeChange(e, 'whatsapp')}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} {country.country}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={formData.starlink_user.whatsappNumber}
                  onChange={handleChange}
                  className="number"
                  placeholder="WhatsApp Number"
                  required
                />
              </div>

              <div className="form-group phone-input-group">
              <label htmlFor="confirmPassword" className="signup-labels">Phone Number</label>
                <select
                  className="country-code"
                  value={formData.starlink_user.countryCode}
                  onChange={(e) => handleCountryCodeChange(e, 'phone')}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} {country.country}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.starlink_user.phoneNumber}
                  onChange={handleChange}
                  className="number"
                  placeholder="Phone Number"
                  required
                />
              </div>

              <button type="submit" className="signup-button" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>

              <div className="login-link">
                Already have an account?
                {' '}
                <Link to="/login">Login</Link>
              </div>
            </form>
          </div>
        </div>
        <div className="signup-image-section" />
      </div>
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

export default SignUp;