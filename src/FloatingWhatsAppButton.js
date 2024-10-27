// FloatingWhatsAppButton.js
import React from 'react';
import './style.css'; 

const FloatingWhatsAppButton = () => {
  const whatsappNumber = "8667839474"; // Replace with your WhatsApp number
  const message = "Hello! I need help with..."; // Default message

  const handleClick = () => {
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="whatsapp-button" onClick={handleClick}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
        alt="WhatsApp"
        className="whatsapp-icon"
      />
      Chat with us
    </div>
  );
};

export default FloatingWhatsAppButton;
