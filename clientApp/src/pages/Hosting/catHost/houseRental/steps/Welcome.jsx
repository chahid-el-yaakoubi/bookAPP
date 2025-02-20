import React from 'react';
import HostLayout from '../../../ComponentHost/HostLayout';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

const Welcome = () => {
    const navigate = useNavigate();

    const handleExit = () => {
        navigate(-1);
    };

    return (
        <HostLayout>
        <div className="min-h-screen bg-white">
            {/* Top Navigation */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
                <div className="w-8">
                    {/* Logo placeholder */}
                </div>
                <div className="flex gap-4 items-center">
                    <button className="px-4 py-2 hover:bg-gray-100 rounded-full">
                        Questions?
                    </button>
                    <button 
                        onClick={handleExit}
                        className="px-4 py-2 hover:bg-gray-100 rounded-full"
                    >
                        Exit
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-semibold mb-4">Welcome back, Partner</h1>
                <p className="text-xl mb-8">Start a new listing</p>

                <button
                    onClick={() => navigate('/host/properties/add')}
                    className="w-full flex items-center justify-between p-6 border rounded-xl hover:border-black transition-all duration-200 group"
                >
                    <div className="flex items-center gap-4">
                        <FaHome className="text-2xl" />
                        <span className="text-lg">Create a new listing</span>
                    </div>
                    <FaChevronRight className="text-gray-400 group-hover:text-black transition-colors" />
                </button>
            </div>
        </div>
        </HostLayout>
    );
};

export default Welcome; 