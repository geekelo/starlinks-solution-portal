import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import '../styles/WhatsAppButton.css'; // Create a CSS file for styling

const WhatsAppButton = () => {
  const phoneNumber = '+2348028595303';
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <a href={whatsappLink} className="whatsapp-button" target="_blank" rel="noopener noreferrer">
      <FaWhatsapp size={24} />
      <span>Click to start chat</span>
    </a>
  );
};

export default WhatsAppButton; 