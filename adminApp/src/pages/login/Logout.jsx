import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContect";
import { logout } from "../../Lib/api";
import PropTypes from 'prop-types';

const Logout = ({ open, setOpen }) => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(open);

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  const closeModal = () => {
    setIsModalOpen(false);
    setOpen(false);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout();
      dispatch({ type: 'LOGOUT' });
      navigate("/login");
      closeModal();
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally show error message to user
    }
  };

  return (
    <div className="logout-container">
      {/* <button
        onClick={openModal}
        className="logout-button bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button> */}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirm Logout</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Logout.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default Logout;
