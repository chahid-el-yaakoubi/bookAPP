import React from 'react'
import { BathroomAmenitiesSelector } from './C_photos/AddBathroom'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { selectProperty } from '../../../../../../../redux/actions/propertyActions';
import { updateProperty } from '../../../../../../../Lib/api';


export const Bathrooms = () => {
    const selectedProperty = useSelector(state => state.property.selectedProperty);
    const { id } = useParams();
    const dispatch = useDispatch();

    const [formData, setFormData] = React.useState({
        bathrooms: selectedProperty?.property_details?.bathrooms || []
      });
      
      const handleSave = async () => {
        try {
          const updatedProperty = {
             'property_details.bathrooms': formData.bathrooms
          };

             
          
      
          const res = await updateProperty(selectedProperty?._id, updatedProperty);

      
          if (res.status === 200) {
            dispatch(selectProperty(res.data));  // ✅ Be careful: you're overwriting selectedProperty
            alert('Property updated successfully');
          } else {
            console.error('Failed to update property');
          }
        } catch (error) {
          console.error("Error during update:", error);
        }
      };
      

    return (
        <BathroomAmenitiesSelector bathrooms={formData.bathrooms}
            onBathroomsChange={(bathrooms) => setFormData(prev => ({
                ...prev,
                bathrooms
            }))} 
            handleSave={handleSave}
            />
    )
}
