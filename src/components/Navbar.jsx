import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Define navigation links in one place to avoid duplication
  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/billing", label: "Billing" },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="logo-container" aria-label="Starlink Home">
        <img src="/starlink-logo.png" alt="Logo" className="logo" />
      </Link>

      <div className="nav-center">
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className={location.pathname === link.to ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="nav-right">
        <div className="user-avatar">
          <span>
            <Link to="/profile">
              <FaUserCircle size={24} />
            </Link>
          </span>
        </div>
      </div>

      {/* Hamburger icon only for mobile view */}
      <button
        type="button"
        className={`hamburger ${isMenuOpen ? 'active' : ''} mobile-only`}
        onClick={toggleMenu}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
      >
        <span />
        <span />
        <span />
      </button>

      <div
        id="mobile-menu"
        className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}
        aria-hidden={!isMenuOpen}
      >
        {navLinks.map((link) => (
          <Link 
            key={link.to}
            to={link.to} 
            className={location.pathname === link.to ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;