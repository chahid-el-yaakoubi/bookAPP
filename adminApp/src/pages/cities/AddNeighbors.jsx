import { useState } from 'react';
import axios from 'axios';

const AddNeighbors = ({ city, onClose, onNeighborsUpdated }) => {
    const [neighborName, setNeighborName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!neighborName.trim()) return;

        try {
            setLoading(true);
            const response = await axios.patch(`/api/cities/${city._id}/neighbors`, {
                neighbors: neighborName.trim()
            });

            if (response.data) {
                alert('Neighbor added successfully');
                onNeighborsUpdated();
                setNeighborName('');
                onClose();
            }
        } catch (error) {
            alert(`Failed to add neighbor: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Add Neighbor City</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <input
                        type="text"
                        value={neighborName}
                        onChange={(e) => setNeighborName(e.target.value)}
                        placeholder="Enter neighbor name"
                        disabled={loading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <div className="flex space-x-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading || !neighborName}
                            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Adding...' : 'Add Neighbor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNeighbors; 


