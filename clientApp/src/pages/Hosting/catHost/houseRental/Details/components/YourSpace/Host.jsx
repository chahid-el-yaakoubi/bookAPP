import { useState } from 'react';
import { FaUser, FaLanguage, FaClock, FaMedal, FaUpload } from 'react-icons/fa';

const Host = () => {
    const [bio, setBio] = useState('');
    const [languages, setLanguages] = useState([]);
    const [responseTime, setResponseTime] = useState('within_hour');
    const [hostingSince, setHostingSince] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    const languageOptions = [
        'English', 'Spanish', 'French', 'German', 'Italian', 
        'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'
    ];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">About the Host</h2>
            <p className="text-gray-600 mb-6">
                Help guests get to know you better.
            </p>

            <div className="space-y-6">
                {/* Profile Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Image
                    </label>
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 relative">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                    <FaUser className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="cursor-pointer bg-blue text-white px-4 py-2 rounded-lg hover:bg-blue/90 transition-colors inline-flex items-center gap-2">
                                <FaUpload />
                                Upload Photo
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </label>
                            <p className="text-sm text-gray-500 mt-1">
                                JPG, PNG, GIF up to 10MB
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[150px]"
                        placeholder="Tell guests about yourself and your hosting style..."
                    />
                </div>

                {/* Languages */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Languages Spoken
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {languageOptions.map((language) => (
                            <button
                                key={language}
                                onClick={() => {
                                    if (languages.includes(language)) {
                                        setLanguages(languages.filter(lang => lang !== language));
                                    } else {
                                        setLanguages([...languages, language]);
                                    }
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                    ${languages.includes(language)
                                        ? 'bg-blue text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {language}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Response Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Typical Response Time
                    </label>
                    <select
                        value={responseTime}
                        onChange={(e) => setResponseTime(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                    >
                        <option value="within_hour">Within an hour</option>
                        <option value="within_hours">Within a few hours</option>
                        <option value="within_day">Within a day</option>
                        <option value="within_days">Within a few days</option>
                    </select>
                </div>

                {/* Hosting Since */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hosting Since
                    </label>
                    <input
                        type="date"
                        value={hostingSince}
                        onChange={(e) => setHostingSince(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                    />
                </div>

                {/* Host Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FaMedal className="w-6 h-6 text-blue" />
                        <div>
                            <h3 className="font-medium">Superhost Status</h3>
                            <p className="text-sm text-gray-600">
                                Maintain high ratings and exceptional hospitality to earn Superhost status
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Host; 