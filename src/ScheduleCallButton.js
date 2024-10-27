// ScheduleCallButton.js
import React, { useState } from 'react';
import './style.css'; 

const ScheduleCallButton = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="schedule-call-button" onClick={handleOpenModal}>
        <i className="fas fa-video" style={{ marginRight: '8px' }}></i>
        Schedule a Call
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Schedule a Call</h2>
            <a
              href="https://calendly.com/akshaya1907" // Replace with your actual Calendly link
              target="_blank"
              rel="noopener noreferrer"
              className="schedule-link"
            >
              Schedule a call with us
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default ScheduleCallButton;
