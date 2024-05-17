import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__next'); // This is to avoid accessibility issues with Next.js

const PartModal = ({ isOpen, onRequestClose, part, value, onChange }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Part"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Edit {part.charAt(0).toUpperCase() + part.slice(1)}</h2>
        <textarea
          value={value}
          onChange={(e) => onChange(part, e.target.value)}
          className="w-full h-64 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={onRequestClose}
          className="mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default PartModal;