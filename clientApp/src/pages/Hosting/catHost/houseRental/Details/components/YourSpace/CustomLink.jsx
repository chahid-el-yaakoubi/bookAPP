import { useState } from 'react';
import { FaLink, FaCopy, FaFacebook, FaTwitter, 
         FaInstagram, FaLinkedin } from 'react-icons/fa';

const CustomLink = () => {
    const [customUrl, setCustomUrl] = useState('');
    const [showQRCode, setShowQRCode] = useState(false);
    const baseUrl = 'yourwebsite.com/stay/';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${baseUrl}${customUrl}`);
        // Add toast notification here
    };

    const socialPlatforms = [
        { name: 'Facebook', icon: FaFacebook, color: 'bg-blue-600' },
        { name: 'Twitter', icon: FaTwitter, color: 'bg-sky-500' },
        { name: 'Instagram', icon: FaInstagram, color: 'bg-pink-600' },
        { name: 'LinkedIn', icon: FaLinkedin, color: 'bg-blue-700' }
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Custom Link</h2>
            <p className="text-gray-600 mb-6">
                Create a custom link for your property to share on social media or with potential guests.
            </p>

            <div className="space-y-6">
                {/* Custom URL Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom URL
                    </label>
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                {baseUrl}
                            </span>
                            <input
                                type="text"
                                value={customUrl}
                                onChange={(e) => setCustomUrl(e.target.value)}
                                className="w-full pl-[140px] p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                placeholder="your-custom-url"
                            />
                        </div>
                        <button
                            onClick={handleCopyLink}
                            className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 flex items-center gap-2"
                        >
                            <FaCopy />
                            Copy
                        </button>
                    </div>
                </div>

                {/* QR Code */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">QR Code</h3>
                        <button
                            onClick={() => setShowQRCode(!showQRCode)}
                            className="text-blue hover:text-blue/90 flex items-center gap-2"
                        >
                            <FaLink />
                            {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
                        </button>
                    </div>
                    {showQRCode && (
                        <div className="border rounded-lg p-6 flex flex-col items-center">
                            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center mb-4">
                                {/* QR Code would be generated here */}
                                <FaLink className="w-24 h-24 text-gray-400" />
                            </div>
                            <button className="text-blue hover:text-blue/90">
                                Download QR Code
                            </button>
                        </div>
                    )}
                </div>

                {/* Social Sharing */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Share on Social Media</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {socialPlatforms.map((platform) => (
                            <button
                                key={platform.name}
                                className={`${platform.color} text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90`}
                            >
                                <platform.icon />
                                {platform.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Analytics Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-4">Link Analytics</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue">0</div>
                            <div className="text-sm text-gray-600">Total Views</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue">0</div>
                            <div className="text-sm text-gray-600">Clicks</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue">0%</div>
                            <div className="text-sm text-gray-600">Conversion Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomLink; 