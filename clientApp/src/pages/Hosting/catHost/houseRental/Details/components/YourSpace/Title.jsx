import { useState } from 'react';

const Title = () => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        
        if (newTitle.length > 50) {
            setError('Title should be 50 characters or less');
        } else {
            setError('');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Property Title</h2>
            <p className="text-gray-600 mb-6">
                Create a title that highlights what makes your place special.
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="e.g., Cozy Beachfront Villa with Ocean Views"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                        maxLength={50}
                    />
                    <div className="mt-2 flex justify-between">
                        <span className="text-red-500 text-sm">{error}</span>
                        <span className="text-gray-500 text-sm">
                            {title.length}/50 characters
                        </span>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Tips for a great title:</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Highlight unique features</li>
                        <li>Mention the property type</li>
                        <li>Include location benefits</li>
                        <li>Keep it concise and clear</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Title; 