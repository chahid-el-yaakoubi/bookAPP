import React from 'react';
import { FaFacebook, FaTwitter, FaWhatsapp, FaEnvelope, FaCopy } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export const SharePropertyModal = ({ isOpen, onClose, property, onShare }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const shareOptions = [
    { id: 'facebook', icon: <FaFacebook className="text-blue-600" />, label: 'Facebook' },
    { id: 'twitter', icon: <FaTwitter className="text-blue-400" />, label: 'Twitter' },
    { id: 'whatsapp', icon: <FaWhatsapp className="text-green-500" />, label: 'WhatsApp' },
    { id: 'email', icon: <FaEnvelope className="text-gray-600" />, label: 'Email' },
    { id: 'copy', icon: <FaCopy className="text-gray-600" />, label: t('singleProperty.copyLink') },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('singleProperty.shareProperty')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {shareOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onShare(option.id)}
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
 