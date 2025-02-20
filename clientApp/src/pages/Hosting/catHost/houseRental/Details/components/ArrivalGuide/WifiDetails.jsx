import { useState } from 'react';
import { FaWifi, FaEye, FaEyeSlash, FaCopy } from 'react-icons/fa';

const WifiDetails = () => {
    const [networkName, setNetworkName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [additionalNetworks, setAdditionalNetworks] = useState([]);
    const [notes, setNotes] = useState('');

    const handleCopyCredentials = () => {
        const credentials = `Network: ${networkName}\nPassword: ${password}`;
        navigator.clipboard.writeText(credentials);
        // Add toast notification here
    };

    const addNetwork = () => {
        setAdditionalNetworks([
            ...additionalNetworks,
            { name: '', password: '', location: '' }
        ]);
    };

    const updateNetwork = (index, field, value) => {
        const updatedNetworks = [...additionalNetworks];
        updatedNetworks[index][field] = value;
        setAdditionalNetworks(updatedNetworks);
    };

    const removeNetwork = (index) => {
        setAdditionalNetworks(additionalNetworks.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">WiFi Details</h2>
            <p className="text-gray-600 mb-6">
                Provide WiFi credentials and internet access information for your guests.
            </p>

            <div className="space-y-6">
                {/* Main Network */}
                <div className="bg-white p-6 border rounded-lg space-y-4">
                    <h3 className="text-lg font-medium">Main Network</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Network Name (SSID)
                        </label>
                        <div className="relative">
                            <FaWifi className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={networkName}
                                onChange={(e) => setNetworkName(e.target.value)}
                                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                placeholder="Enter network name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                placeholder="Enter network password"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleCopyCredentials}
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            <FaCopy />
                            Copy Credentials
                        </button>
                        <button
                            onClick={() => setShowQRCode(!showQRCode)}
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            <FaWifi />
                            {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
                        </button>
                    </div>

                    {showQRCode && (
                        <div className="mt-4 flex justify-center">
                            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                                {/* QR Code would be generated here */}
                                <FaWifi className="w-24 h-24 text-gray-400" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Additional Networks */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Additional Networks</h3>
                        <button
                            onClick={addNetwork}
                            className="px-4 py-2 text-blue hover:text-blue/90"
                        >
                            + Add Network
                        </button>
                    </div>

                    {additionalNetworks.map((network, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Network Name
                                    </label>
                                    <input
                                        type="text"
                                        value={network.name}
                                        onChange={(e) => updateNetwork(index, 'name', e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="text"
                                        value={network.password}
                                        onChange={(e) => updateNetwork(index, 'password', e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={network.location}
                                        onChange={(e) => updateNetwork(index, 'location', e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                        placeholder="e.g., Guest house, Pool area"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => removeNetwork(index)}
                                className="mt-2 text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* Additional Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                        placeholder="Add any additional information about internet access..."
                    />
                </div>
            </div>
        </div>
    );
};

export default WifiDetails; 