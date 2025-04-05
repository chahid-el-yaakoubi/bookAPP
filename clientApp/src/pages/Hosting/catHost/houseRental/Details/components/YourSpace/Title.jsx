import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UPDATE_PROPERTY } from '../../../../../../../redux/actions/propertyActions'; // Update the path as needed
import { useTranslation } from 'react-i18next';
import { Camera } from 'lucide-react';

const Title = () => {
    const { t } = useTranslation(['properties']);
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);
    
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    
    // Initialize the title when the selected property changes
    useEffect(() => {
        if (selectedProperty && selectedProperty.title) {
            setTitle(selectedProperty.title);
        }
    }, [selectedProperty]);

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        
        if (newTitle.length > 50) {
            setError(t('titleError'));
        } else {
            setError('');
        }
        
        // Clear any previous save messages when editing
        if (saveMessage) {
            setSaveMessage('');
        }
    };
    
    const handleSave = () => {
        if (error) {
            return; // Don't save if there are validation errors
        }
        
        if (!selectedProperty) {
            setSaveMessage(t('titleUpdateError'));
            return;
        }
        
        setIsSaving(true);
        
        // Create updated property object with the new title
        const updatedProperty = {
            ...selectedProperty,
            title: title
        };
        
        // Dispatch the update action
        dispatch({
            type: UPDATE_PROPERTY,
            payload: { updatedProperty }
        });
        
        // Show success message and reset saving state
        setTimeout(() => {
            setIsSaving(false);
            setSaveMessage(t('titleUpdateSuccess'));
            
            // Clear the success message after a few seconds
            setTimeout(() => {
                setSaveMessage('');
            }, 3000);
        }, 500);
    };

    // Get property image from selectedProperty or use a placeholder
    const propertyImage = selectedProperty?.property_details?.photos[0]?.url || "/api/placeholder/1200/600";

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative w-full h-80 rounded-xl overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ 
                        backgroundImage: `url(${propertyImage})`,
                        filter: 'brightness(0.7)'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                {/* Property title overlay with edit capability */}
                <div className="absolute bottom-0 left-0 w-full p-6">
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder={t('titlePlaceholder')}
                        className="w-full bg-transparent text-white text-4xl font-bold border-0 focus:ring-0 focus:outline-none placeholder-white/60"
                        maxLength={50}
                    />
                    <div className="mt-2 flex justify-between">
                        <span className="text-red-300 text-sm">{error}</span>
                        <span className="text-white/80 text-sm">
                            {title.length}/50 {t('characters')}
                        </span>
                    </div>
                </div>
                
                {/* Change image button */}
                {/* <button className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white">
                    <Camera size={20} />
                </button> */}
            </div>
            
            {/* Content Section */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">{t('propertyTitle')}</h2>
                <p className="text-gray-600 mb-6">
                    {t('titleDescription')}
                </p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('title')}
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder={t('titlePlaceholder')}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            maxLength={50}
                        />
                        <div className="mt-2 flex justify-between">
                            <span className="text-red-500 text-sm">{error}</span>
                            <span className="text-gray-500 text-sm">
                                {title.length}/50 {t('characters')}
                            </span>
                        </div>
                    </div>
                    
                    {/* Save button and status message */}
                    <div className="flex items-center justify-between mt-6">
                        <div>
                            {saveMessage && (
                                <span className={`text-sm ${saveMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                                    {saveMessage}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !!error || title === selectedProperty?.title}
                            className={`px-4 py-2 rounded-lg text-white font-medium ${
                                isSaving || !!error || title === selectedProperty?.title
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue hover:bg-blue-600'
                            }`}
                        >
                            {isSaving ? t('saving') : t('saveChanges')}
                        </button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mt-6">
                        <h3 className="font-medium mb-2">{t('tipsForTitle')}</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>{t('highlightUniqueFeatures')}</li>
                            <li>{t('mentionPropertyType')}</li>
                            <li>{t('includeLocationBenefits')}</li>
                            <li>{t('properties:keepItConcise')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Title;