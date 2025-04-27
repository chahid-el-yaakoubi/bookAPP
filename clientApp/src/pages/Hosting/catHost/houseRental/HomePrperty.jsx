import React, { useState } from 'react'
import PropertiesHost from './PropertiesHost'
import HotelsHost from './HotelsHost'

export const HomePrperty = () => {
    const [type , setType] = useState('houses')

    const setHouses = ()=>{
        setType('houses')
    }
    
    const setHotels = ()=>{
        setType('hotels')
    }
    return (

        <>
           
            {type === 'houses'   ?  <PropertiesHost setHousesType={setHouses} setHotelsType={setHotels} ListType={type} /> : <HotelsHost setHousesType={setHouses} setHotelsType={setHotels} ListType={type} /> }
        </>

    )
}
