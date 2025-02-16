import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">STARLINK</div>
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="#residential">RESIDENTIAL</a>
          <a href="#roam">ROAM</a>
        </div>
      </div>
      <div className={`navbar-right ${isMenuOpen ? 'active' : ''}`}>
        <a href="#personal" className="personal-link">PERSONAL</a>
        <a href="#business">BUSINESS</a>
      </div>
      <button
        type="button"
        className="hamburger"
        onClick={toggleMenu}
        aria-label="Menu"
        aria-expanded={isMenuOpen}
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
};

export default Navbar;
