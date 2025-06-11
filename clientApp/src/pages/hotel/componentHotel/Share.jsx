import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaWhatsapp, FaEnvelope, FaCopy, FaCheck } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export const SharePropertyModal = ({ isOpen, onClose, property }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate the property URL - adjust this based on your routing structure
  const propertyUrl = `${window.location.origin}/property/${property?.id || property?.slug || ''}`;
  
  // Property details for sharing
  const shareTitle = property?.title || 'Check out this property';
  const shareDescription = property?.description || 'Amazing property listing';

  const handleShare = async (platform) => {
    switch (platform) {
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
        break;

      case 'twitter':
        const twitterText = `${shareTitle} - ${shareDescription}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(propertyUrl)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
        break;

      case 'whatsapp':
        const whatsappText = `${shareTitle}\n${shareDescription}\n${propertyUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
        window.open(whatsappUrl, '_blank');
        break;

      case 'email':
        const emailSubject = encodeURIComponent(shareTitle);
        const emailBody = encodeURIComponent(`${shareDescription}\n\nView property: ${propertyUrl}`);
        window.location.href = `mailto:?subject=${emailSubject}&body=${emailBody}`;
        break;

      case 'copy':
        try {
          await navigator.clipboard.writeText(propertyUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = propertyUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        break;

      default:
        break;
    }
  };

  const shareOptions = [
    { id: 'facebook', icon: <FaFacebook className="text-blue-600" />, label: 'Facebook' },
    { id: 'twitter', icon: <FaTwitter className="text-blue-400" />, label: 'Twitter' },
    { id: 'whatsapp', icon: <FaWhatsapp className="text-green-500" />, label: 'WhatsApp' },
    { id: 'email', icon: <FaEnvelope className="text-gray-600" />, label: 'Email' },
    { 
      id: 'copy', 
      icon: copied ? <FaCheck className="text-green-500" /> : <FaCopy className="text-gray-600" />, 
      label: copied ? t('singleProperty.copied') || 'Copied!' : t('singleProperty.copyLink') || 'Copy Link'
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('singleProperty.shareProperty') || 'Share Property'}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success message for copy action */}
        {copied && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <FaCheck className="text-green-500" />
            <span>{t('singleProperty.linkCopied') || 'Link copied to clipboard!'}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {shareOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleShare(option.id)}
              className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                option.id === 'copy' && copied 
                  ? 'bg-green-50 border-green-300 text-green-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        {/* Property URL preview */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">{t('singleProperty.shareUrl') || 'Share URL:'}</p>
          <p className="text-sm text-gray-800 break-all">{propertyUrl}</p>
        </div>
      </div>
    </div>
  );
};