import React, { useState, useEffect } from 'react';
import PropertiesHost from './PropertiesHost';
import HotelsHost from './HotelsHost';

export const HomePrperty = () => {
    const [type, setType] = useState(() => {
        // Read the saved type from localStorage, default to 'houses'
        return localStorage.getItem('propertyType') || 'houses';
    });

    useEffect(() => {
        // Whenever 'type' changes, save it to localStorage
        localStorage.setItem('propertyType', type);
    }, [type]);

    const setHouses = () => {
        setType('houses');
    };
    
    const setHotels = () => {
        setType('hotels');
    };

    return (
        <>
            {type === 'houses' 
                ? <PropertiesHost setHousesType={setHouses} setHotelsType={setHotels} ListType={type} /> 
                : <HotelsHost setHousesType={setHouses} setHotelsType={setHotels} ListType={type} />}
        </>
    );
};
