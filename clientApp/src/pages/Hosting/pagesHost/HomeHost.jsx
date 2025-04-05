import { FaSearch } from 'react-icons/fa';
import StatCard from '../ComponentHost/StatCard';
import HostLayout from '../ComponentHost/HostLayout';
import { useEffect } from 'react';
import axios from 'axios';

const HomeHost = () => {


    const ssza = async () => {
        const data = await axios.get('/api/hotels');
        console.log(data)
    }
    ssza()


    return (
        <HostLayout>
            <main className="flex-1 p-4 md:p-6 bg-blue/40">
                {/* Header with Search and Profile */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center flex-1 max-w-xs">
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue"
                            />
                        </div>
                    </div>
                    <div className="flex items-center ml-4">
                        <button className="hidden md:block px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue">
                            + Add Listing
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gray-300 ml-4"></div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard title="Total Listings" value="124" change="+12%" />
                    <StatCard title="Active Bookings" value="48" change="+5%" />
                    <StatCard title="Monthly Revenue" value="$12,456" change="+8%" />
                    <StatCard title="Total Reviews" value="1,234" change="+15%" />
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="font-semibold text-lg mb-4">Recent Bookings</h3>
                        {/* Add booking list component here */}
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="font-semibold text-lg mb-4">Performance Analytics</h3>
                        {/* Add charts component here */}
                    </div>
                </div>
            </main>
        </HostLayout>
    );
};

export default HomeHost;
