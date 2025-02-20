import { useState } from 'react';

const Description = () => {
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleDescriptionChange = (e) => {
        const newDescription = e.target.value;
        setDescription(newDescription);
        
        if (newDescription.length > 500) {
            setError('Description should be 500 characters or less');
        } else {
            setError('');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Property Description</h2>
            <p className="text-gray-600 mb-6">
                Tell potential guests what makes your place special.
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Describe your property's unique features, amenities, and location..."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[200px]"
                        maxLength={500}
                    />
                    <div className="mt-2 flex justify-between">
                        <span className="text-red-500 text-sm">{error}</span>
                        <span className="text-gray-500 text-sm">
                            {description.length}/500 characters
                        </span>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Writing tips:</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Highlight unique features and amenities</li>
                        <li>Describe the atmosphere and style</li>
                        <li>Mention nearby attractions</li>
                        <li>Be honest and accurate</li>
                        <li>Use clear, concise language</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Description; 