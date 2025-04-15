import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Header } from '../../components/Header';
import { Listitem } from './listItem/Listitem';
import BlurListItem from './listItem/BlurListItem';
import { SearchContext } from '../../contextApi/SearchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownWideShort,
  faHouse,
  faHouseFlag,
  faHotel,
  faArrowUpFromWaterPump,
  faSliders
} from '@fortawesome/free-solid-svg-icons';
import useFetch from '../../hooks/useFetch';

// Import styles once at the top
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { HotelCard, HotelCardGrid } from './listItem/HotelsDisplay';
import HotelsList from './listItem/HotelsList';
import { useDispatch, useSelector } from 'react-redux';
import { setHotels } from '../../redux/hotelsSlice';
import Footer from '../../components/footer';


export const List = () => {
  const { city } = useContext(SearchContext);
const location = useLocation();


  const dispatch = useDispatch();
  const hotels = useSelector((state) => state.hotels.filteredHotels);
  const selectedFilter = useSelector((state) => state.hotels.selectedFilter);

  const City = city?.toLowerCase();
  const { data, loading, error, reFetch } = useFetch(`/api/hotels?city=${City}`);

  useEffect(() => {
    if (data) {
      dispatch(setHotels(data));

    }
  }, [data])



  // Fetch data when location changes
  useEffect(() => {
    reFetch();
  }, [location]);



  // Handle errors
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-xl font-semibold text-red-600">Error loading data</h2>
          <p className="text-red-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue/30 min-h-screen">
      <Navbar />
      <Header type="house_rental" />
      <div className="flex flex-col items-center justify-center w-full mt-20">
        <HotelsList city={City} />

        <div className="container w-full px-2 sm:px-4 mt-20">
          {/* Filter Controls */}
          <HotelCardGrid hotels={hotels} />


        </div>

        <Footer />
      </div>
    </div>
  );
};