import React, { useState, useRef, useEffect } from 'react';
import { Share2, Mail, Copy, X } from 'lucide-react';

export const SharePropertyModal = ({ isOpen, onClose, property }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const modalRef = useRef(null);

  // Mock property data if not provided
  const propertyData = property || {
    id: 1,
    title: "Modern Beachfront Villa",
    location: "Malibu, California",
    price: 350,
    imageUrl: "/api/placeholder/800/500"
  };

  // Example property URL
  const propertyUrl = `https://yourdomain.com/properties/${propertyData.id}`;

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(propertyUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Share options with their respective URLs
  const shareOptions = [
    {
      name: "WhatsApp",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.627-5.372-12-12-12zm.03 18.88C7.175 18.92 3.59 15.907 3.55 11.16c0-2.313.866-4.444 2.292-6.082L3.59 8.142l2.56-1.191 2.134 1.759-.831-2.581 2.337-1.453 1.234 2.205 1.33-2.205 2.628 1.37-1.303 2.669 2.628-1.542-.524 2.67 2.337-.872-2.134 1.976c1.304 1.628 2.008 3.59 2.008 5.726-.04 4.764-3.655 7.805-8.333 7.805z" />
        </svg>
      ),
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      url: `https://wa.me/?text=${encodeURIComponent(`Check out this property: ${propertyData.title} - ${propertyUrl}`)}`
    },
    {
      name: "Gmail",
      icon: <Mail className="w-5 h-5" />,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      url: `mailto:?subject=${encodeURIComponent(`Check out this property: ${propertyData.title}`)}&body=${encodeURIComponent(`I found this amazing property and thought you might be interested:\n\n${propertyData.title} in ${propertyData.location}\n\n${propertyUrl}`)}`
    },
    {
      name: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: "bg-blue",
      hoverColor: "hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`
    },
    {
      name: "Twitter",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.032 10.032 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
        </svg>
      ),
      color: "bg-sky-500",
      hoverColor: "hover:bg-sky-600",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this property: ${propertyData.title}`)}&url=${encodeURIComponent(propertyUrl)}`
    },
    {
      name: "Telegram",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.175.786-.841 3.757-1.175 5.335-.142.665-.302 1.818-.302 1.818s-.021.227-.207.353c-.224.153-.366.118-.366.118l-2.18 1.06s-.658.318-1.51-.154c-1.005-.559-2.178-1.59-2.854-2.222-.188-.177-.333-.368-.333-.63 0-.17.113-.34.113-.34s3.179-2.881 3.468-3.218c.05-.059.106-.226-.036-.334-.158-.118-.368-.043-.368-.043l-4.494 2.784s-.298.175-.532.175c-.17 0-.352-.043-.575-.132-.488-.198-1.074-.411-1.074-.411s-.638-.36-.042-.74c0 0 .855-.631 1.716-1.205 1.592-1.063 3.147-2.095 3.853-2.575.696-.477 1.494-.953 2.370-.953.48 0 .638.222.638.53 0 .135-.02.297-.02.465z" />
        </svg>
      ),
      color: "bg-cyan-500",
      hoverColor: "hover:bg-blue-600",
      url: `https://t.me/share/url?url=${encodeURIComponent(propertyUrl)}&text=${encodeURIComponent(`Check out this property: ${propertyData.title}`)}`
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Share this property</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center space-x-3 mb-6">
          <img 
            src={propertyData.imageUrl} 
            alt={propertyData.title} 
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <h4 className="font-medium">{propertyData.title}</h4>
            <p className="text-gray-500 text-sm">{propertyData.location}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center p-3 rounded-lg ${option.color} ${option.hoverColor} text-white transition-colors`}
            >
              {option.icon}
              <span className="text-xs mt-1">{option.name}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center border rounded-lg overflow-hidden">
          <input
            type="text"
            value={propertyUrl}
            readOnly
            className="flex-grow p-3 text-sm outline-none"
          />
          <button
            onClick={copyToClipboard}
            className={`p-3 ${copySuccess ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          >
            {copySuccess ? 'Copied!' : <Copy className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
 