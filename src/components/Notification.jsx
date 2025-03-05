// Notification.js
import React from 'react';

const Notification = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded shadow-lg">
      <div>{message}</div>
      <button onClick={onClose} className="ml-2 text-white underline">Fermer</button>
    </div>
  );
};

export default Notification;
