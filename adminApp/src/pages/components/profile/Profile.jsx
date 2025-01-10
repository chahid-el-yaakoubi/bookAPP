import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faEdit } from '@fortawesome/free-solid-svg-icons';

export const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Profile</h2>
      
      <div className="flex items-center mb-6">
        <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-500 mr-4" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">John Doe</h3>
          <p className="text-gray-600">Administrator</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-4" />
          <div>
            <h4 className="text-sm font-medium text-gray-700">Email</h4>
            <p className="text-gray-900">john.doe@example.com</p>
          </div>
        </div>

        <div className="flex items-center">
          <FontAwesomeIcon icon={faPhone} className="text-gray-500 mr-4" />
          <div>
            <h4 className="text-sm font-medium text-gray-700">Phone</h4>
            <p className="text-gray-900">+1234567890</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Update Profile</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="block w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="john.doe@example.com"
              className="block w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="+1234567890"
              className="block w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};
