import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContect";

const Logout = ({open, setOpen}) => {

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(open);
  const closeModal = () => {
    setIsModalOpen(!open)
    setOpen(false)

  
  };

  const handleConfirmLogout = () => {
    dispatch({ type: "LOGOUT" }); // Dispatch the logout action
    navigate("/login"); // Redirect to login page
    closeModal(); // Close the modal after logout
  };

  return (
    <div>
      {/* <button
        onClick={openModal}
        className="logout-button bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button> */}

      {/* Confirmation Modal */}
      {open && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;
