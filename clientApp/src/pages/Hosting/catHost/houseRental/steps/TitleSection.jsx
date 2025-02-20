import React, { useState, useEffect } from 'react';

const MAX_TITLE_LENGTH = 32;

const TitleSection = ({ propertyData, setPropertyData }) => {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(propertyData.title?.length || 0);
  }, [propertyData.title]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (newTitle.length <= MAX_TITLE_LENGTH) {
      setPropertyData(prev => ({
        ...prev,
        title: newTitle
      }));
      setCharCount(newTitle.length);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Now, let's give your apartment a title</h2>
        <p className="text-gray-600 mt-2">
          Short titles work best. Have fun with it—you can always change it later.
        </p>
      </div>

      <div className="relative">
        <textarea
          value={propertyData.title || ''}
          onChange={handleTitleChange}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
          placeholder="Enter your property title..."
          maxLength={MAX_TITLE_LENGTH}
        />
        <div className="absolute bottom-4 right-4 text-sm text-gray-500">
          {charCount}/{MAX_TITLE_LENGTH}
        </div>
      </div>

      {charCount > 0 && charCount < 10 && (
        <p className="text-amber-600">
          Title should be at least 10 characters long for better visibility
        </p>
      )}

      {charCount === MAX_TITLE_LENGTH && (
        <p className="text-amber-600">
          You've reached the maximum title length
        </p>
      )}
    </div>
  );
};

export default TitleSection; 