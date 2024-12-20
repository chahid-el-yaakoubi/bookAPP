import React from 'react';

const BlurListItem = () => {
  return (
    <div className="bg-gray-100 p-4">
      <div className="grid gap-6">
        {/* Loading Card */}
        <div className="bg-white p-4 rounded-lg shadow-md flex animate-pulse">
          {/* Image Placeholder */}
          <div className="w-1/3 h-36 bg-gray-300 rounded-lg"></div>
          
          {/* Content Placeholder */}
          <div className="ml-4 flex flex-col justify-between w-2/3 space-y-4">
            
            {/* Header Placeholder */}
            <div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            
            {/* Details Placeholder */}
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            
            {/* Footer Placeholder */}
            <div className="flex items-center justify-between mt-4">
              <div className="space-y-1 text-right">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="h-8 w-28 bg-blue-300 rounded"></div>
            </div>
            
            {/* Rating Placeholder */}
            <div className="flex items-center mt-2">
              <div className="h-6 w-6 bg-blue-400 rounded-md mr-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlurListItem;
