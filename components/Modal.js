import React from 'react';

const Modal = ({ isOpen, onClose, title, children, onOk }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            onClick={onOk}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
