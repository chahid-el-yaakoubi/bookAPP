import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faMessage,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ContactModal } from './ContactModal';

export const ContactOwnersModule = ({ hotel = {}, className = "", onClose }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneTooltip, setShowPhoneTooltip] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");

  const CONTACT_INFO = {
    phone: "+212 123-456-789",
    whatsapp: "+212123456789",
    email: "reservations@hotel.com"
  };

  const handlePhoneCall = (event) => {
    if (event.detail === 2) {
      // Double click - make phone call
      window.location.href = `tel:${CONTACT_INFO.phone}`;
    } else if (showPhoneTooltip) {
      // Second click - copy number
      navigator.clipboard.writeText(CONTACT_INFO.phone)
        .then(() => {
          setShowPhoneTooltip(true); // Keep showing the number
        })
        .catch(err => {
          console.error('Failed to copy:', err);
        });
    } else {
      // First click - just show the number
      setShowPhoneTooltip(true);
    }
  };

  const handleWhatsAppSubmit = () => {
    if (!customerName.trim() || !hotel.name) return;

    const message = encodeURIComponent(
      `Hello, I'm ${customerName}. I'm interested in:\n\n` +
      `Property: ${hotel.name}\n` +
      `ID: ${hotel.id}\n` +
      `Location: ${hotel.city}\n\n` +
      `I would like to get more information about this property.`
    );

    window.location.href = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`;
    setIsWhatsAppModalOpen(false);
    setCustomerName("");
  };

  const handleEmail = () => {
    window.location.href = `mailto:${CONTACT_INFO.email}`;
  };

  const contactButtons = [
    {
      label: showPhoneTooltip ? (
        <div className="flex flex-col items-center">
          <span>{CONTACT_INFO.phone}</span>
          <span className="text-xs opacity-75">Click to copy</span>
        </div>
      ) : "Call Us",
      onClick: handlePhoneCall,
      icon: faPhone,
      bgColor: "bg-green-500 hover:bg-green-600",
      description: showPhoneTooltip ? "Number copied! Double-click to call" : "Direct phone call for immediate assistance"
    },
    {
      label: "WhatsApp",
      onClick: () => setIsWhatsAppModalOpen(true),
      icon: faMessage,
      bgColor: "bg-[#25D366] hover:bg-[#128C7E]",
      description: "Quick chat through WhatsApp messenger"
    },
    {
      label: "Contact Form",
      onClick: () => setIsContactModalOpen(true),
      icon: faMessage,
      bgColor: "bg-blue hover:bg-blue/80",
      description: "Send us a detailed inquiry via contact form"
    },
  ];

  return (
    <div className="fixed inset-0 z-50 h-[100vh] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative rounded-lg max-w-xl w-full m-4 h-[80vh] bg-white">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faCircleXmark} className="text-2xl" />
        </button>
        
        <div className={`space-y-6 ${className} w-full bg-white shadow-xl rounded-lg p-6 h-full `}>
          <h2 className="text-2xl font-semibold text-center mb-8">Reserve by Contact</h2>
          
          <div className="flex flex-col items-center justify-center space-y-6 h-full">
            {/* Contact Options Grid */}
            <div className="grid grid-cols-1 gap-6 w-full max-w-md">
              {contactButtons.map(({ label, onClick, icon, bgColor, description }) => (
                <div key={label} className="space-y-2">
                  <button
                    onClick={onClick}
                    className={`flex items-center justify-center gap-2 ${bgColor} text-white px-6 py-4 rounded-lg font-semibold transition-colors w-full`}
                  >
                    <FontAwesomeIcon icon={icon} className="text-xl" />
                    <span>{label}</span>
                  </button>
                  <p className="text-sm text-gray-600 text-center">{description}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-500 mt-8">
              Our reservation team is available 24/7 to assist you
            </p>
          </div>

          {/* Contact Modal */}
          <ContactModal 
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
            hotel={hotel}
          />

          {/* WhatsApp Modal */}
          {isWhatsAppModalOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
                <h3 className="text-xl font-semibold mb-4">Contact via WhatsApp</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">Preview Message:</p>
                    <p className="text-sm mt-2 whitespace-pre-line">
                      {`Hello, I'm ${customerName || '[Your Name]'}. I'm interested in:

Property: ${hotel.name}
ID: ${hotel.id}
Location: ${hotel.city}

I would like to get more information about this property.`}
                    </p>
                  </div>

                  <div className="flex gap-3 justify-end mt-6">
                    <button
                      onClick={() => {
                        setIsWhatsAppModalOpen(false);
                        setCustomerName("");
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleWhatsAppSubmit}
                      disabled={!customerName.trim()}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                        customerName.trim() 
                          ? 'bg-[#25D366] hover:bg-[#128C7E]' 
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      Continue to WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};