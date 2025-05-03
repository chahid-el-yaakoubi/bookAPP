import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateProperty } from '../../../../../../../Lib/api';
import { selectProperty } from '../../../../../../../redux/actions/propertyActions';

const IsFeatured = () => {
    const { t } = useTranslation(['properties']);
    const selectedProperty = useSelector(state => state.property.selectedProperty);
    const dispatch = useDispatch();
    
    const [isFeatured, setIsFeatured] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    // Initialize the featured status when the selected property changes
    useEffect(() => {
        if (selectedProperty && selectedProperty.featured !== undefined) {
            setIsFeatured(selectedProperty.featured);
        }
    }, [selectedProperty]);

    const handleFeaturedChange = async (e) => {
        const newFeaturedStatus = e.target.checked;
        setIsFeatured(newFeaturedStatus);
        await handleSave(newFeaturedStatus);
    };

    const handleSave = async (newFeaturedStatus) => {
        setIsSaving(true);
        
        // Create updated property object with the new featured status
        const updatedProperty = {
            featured: newFeaturedStatus
        };

        // Dispatch the update action
        const res = await updateProperty(selectedProperty?._id, updatedProperty);
        
        // Show success message and reset saving state
        if (res.status === 200) {
            dispatch(selectProperty(res.data));
            setSaveMessage(t('featuredUpdateSuccess'));
            setTimeout(() => {
                setSaveMessage('');
            }, 3000);
        } else {
            console.error(res);
            setSaveMessage(t('featuredUpdateError'));
        }
        
        setIsSaving(false);
    };

    return (
        <div className="space-y-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">{t('isFeatured')}</h2>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={handleFeaturedChange}
                            className="mr-2"
                        />
                        {t('isFeatured')}
                    </label>
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
                </div>
            </div>
        </div>
    );
};

export default IsFeatured;