import React from 'react';

const StatCard = ({ title, value, change }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <div className="flex items-end mt-2">
            <span className="text-2xl font-semibold">{value}</span>
            <span className="ml-2 text-sm text-green-500">{change}</span>
        </div>
    </div>
);

export default StatCard; 