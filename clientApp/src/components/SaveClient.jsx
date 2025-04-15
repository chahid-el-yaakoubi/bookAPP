import React, { useContext, useEffect, useState } from 'react'
import { User, Camera, Lock, Save, Edit, X } from 'lucide-react';

import { Navbar } from './Navbar'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LuCircleArrowLeft } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { HotelCardGrid } from '../pages/list/listItem/HotelsDisplay';

export const SavedRentalsPage = () => {
    const navigate = useNavigate();
    const hotels = useSelector(state => state.hotels.filteredHotels);
  const reservations = useSelector((state) => state.save.reservations);

  const UserSaved = hotels.filter((item) =>
    reservations.find((saved) => item._id === saved.hotelId)
  );
  
  
    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg  mb-20 min-h-[80vh] shadow-xl">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-blue hover:bg-blue/80 p-2 rounded-full mb-8 mt-5"
                >
                    <LuCircleArrowLeft className="w-6 h-6 text-white" />
                </button>

              

                <HotelCardGrid hotels={UserSaved}/>
            </div>
        </>
    );
};

 