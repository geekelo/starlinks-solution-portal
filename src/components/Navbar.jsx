import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

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

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="logo" aria-label="Starlink Home">
        STARLINK
      </Link>

      <div className="nav-center">
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
            Dashboard
          </Link>
          <Link to="/billing" className={location.pathname === '/billing' ? 'active' : ''}>
            Billing
          </Link>
        </div>
      </div>

      <div className="nav-right">
        <button type="button" className="icon-button" aria-label="Notifications">
          <span className="notification-icon">🔔</span>
        </button>
        <div className="user-avatar">
          <span>M</span>
        </div>
      </div>

      <button
        type="button"
        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
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
        <Link to="/home">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/billing">Billing</Link>
      </div>
    </nav>
  );
};

export default Navbar;
