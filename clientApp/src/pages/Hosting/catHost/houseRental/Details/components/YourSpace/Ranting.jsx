import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateProperty } from '../../../../../../../Lib/api';
import { selectProperty } from '../../../../../../../redux/actions/propertyActions';

const Rating = () => {
    const { t } = useTranslation(['properties']);
    const selectedProperty = useSelector(state => state.property.selectedProperty);
    const dispatch = useDispatch();
    
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    
    // Initialize the rating when the selected property changes
    useEffect(() => {
        if (selectedProperty && selectedProperty.rating) {
            setRating(selectedProperty.rating);
        }
    }, [selectedProperty]);

    const handleRatingChange = (e) => {
        const newRating = e.target.value;
        setRating(newRating);
        
        if (newRating < 1 || newRating > 5) {
            setError(t('ratingError'));
        } else {
            setError('');
        }
        
        // Clear any previous save messages when editing
        if (saveMessage) {
            setSaveMessage('');
        }
    };
    
    const handleSave = async () => {
        if (error) {
            return; // Don't save if there are validation errors
        }
        
        if (!selectedProperty) {
            setSaveMessage(t('ratingUpdateError'));
            return;
        }
        
        setIsSaving(true);
        
        // Create updated property object with the new rating
        const updatedProperty = {
            rating: rating
        };
        
        // Dispatch the update action
        const res = await updateProperty(selectedProperty?._id, updatedProperty);
        
        // Show success message and reset saving state
        if(res.status === 200){
            dispatch(selectProperty(res.data));

            setIsSaving(false);
            setSaveMessage(t('ratingUpdateSuccess'));
            // Clear the success message after a few seconds
            setTimeout(() => {
                setSaveMessage('');
            }, 3000);
        }else{
            (err)=>{
                console.error(err)
            }
        }
    };

    // Get property image from selectedProperty or use a placeholder
    const propertyImage = selectedProperty?.property_details?.photos[0]?.url || "/api/placeholder/1200/600";

    return (
        <div className="space-y-8">
            
            
            {/* Content Section */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">{t('propertyRating')}</h2>
                <p className="text-gray-600 mb-6">
                    {t('ratingDescription')}
                </p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('rating')}
                        </label>
                        <input
                            type="number"
                            value={rating}
                            onChange={handleRatingChange}
                            placeholder={t('ratingPlaceholder')}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            min={1}
                            max={5}
                        />
                        <div className="mt-2 flex justify-between">
                            <span className="text-red-500 text-sm">{error}</span>
                            <span className="text-gray-500 text-sm">
                                {rating}/5 {t('stars')}
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
                            disabled={isSaving || !!error || rating === selectedProperty?.rating}
                            className={`px-4 py-2 rounded-lg text-white font-medium ${
                                isSaving || !!error || rating === selectedProperty?.rating
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue hover:bg-blue-600'
                            }`}
                        >
                            {isSaving ? t('saving') : t('saveChanges')}
                        </button>
                    </div>
                     
                </div>
            </div>
        </div>
    );
};

export default Rating;