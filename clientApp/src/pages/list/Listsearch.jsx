import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';

export const Listsearch = () => {
    const location = useLocation();
    const search = location.state || {}; // Default to an empty object if no state is passed

    const [openDate, setOpenDate] = useState(false);
    const [destination, setDestination] = useState(search.location || "");
    const [Options, setOptions] = useState(search.Options || { Adult: 2, Children: 0, room: 1 });
    const [openoptions, setOpenOptions] = useState(false);

    // Date range state
    const [dateRange, setDateRange] = useState(search.dateRange || [{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);

    // Price range state with default values
    const [price, setPrice] = useState({
        minPrice: search.price?.minPrice || 200, 
        maxPrice: search.price?.maxPrice || 200
    });

    const handleDateChange = (ranges) => {
        setDateRange([ranges.selection]);
    };

    const handleClick = (field, operation, num) => {
        setOptions(prevState => {
            const newValue = operation === 'increase'
                ? prevState[field] + 1
                : Math.max(num, prevState[field] - 1);
            return { ...prevState, [field]: newValue };
        });
    };

    const handleInputChange = (e, field) => {
        const value = parseInt(e.target.value, 10) || 0;
        setOptions(prevState => ({ ...prevState, [field]: value }));
    };

    const handlePriceChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setPrice(prevState => ({ ...prevState, maxPrice: value }));
    };

    const navigate = useNavigate();
    const handleSearch = () => {
        // Navigate to the hotel search results with updated state
        navigate('/hotels', { state: { dateRange, destination, Options, price } });
    }

    return (
        <div className="bg-secondary p-6 rounded-lg mt-10 max-w-sm mx-auto">
            <h3 className="text-lg font-semibold mb-4">Rechercher</h3>

            {/* Destination Input */}
            <label className="block text-sm mb-2">Destination / Nom de l’établissement :</label>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Où allez-vous ?"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
            </div>

            {/* Date Range Picker */}
            <label className="block text-sm mb-2">Sélectionnez vos dates :</label>
            <div className="relative mb-4">
                <span onClick={() => {
                    setOpenDate(!openDate);
                    if (openoptions) setOpenOptions(false);
                }}
                    className="w-full px-4 py-2 cursor-pointer bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex">
                    {`${format(dateRange[0].startDate, "MMM dd, yyyy")} 👉 ${format(dateRange[0].endDate, "MMM dd, yyyy")}`}
                </span>
                {openDate && (
                    <DateRange
                        editableDateInputs
                        onChange={handleDateChange}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                        className="rounded-lg absolute z-50 start-0 top-11 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}
            </div>

            {/* Price Range */}
            <label className="block text-sm mb-2">Prix :</label>
            <div className="mb-4">
                <div className="flex justify-between">
                    <span>Min: MAD{price.minPrice}</span>
                    <span>Max: MAD{price.maxPrice}</span>
                </div>
                <div className="w-full mb-4">
                    <input
                        type="range"
                        min="200"
                        max="2000"
                        step="10"
                        name="maxPrice"
                        value={price.maxPrice}
                        onChange={handlePriceChange}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Guest and Room Details */}
            <label className="block text-sm mb-2">Séjour de {(dateRange[0].endDate - dateRange[0].startDate) / (1000 * 60 * 60 * 24)} nuits</label>
            <div className="relative">
                <span onClick={() => {
                    setOpenOptions(!openoptions);
                    if (dateRange) setDateRange(dateRange);
                }}
                    className="w-full px-4 py-2 rounded-lg border cursor-pointer border-gray-300 bg-white mb-4 focus:outline-none flex focus:ring-2 focus:ring-blue-500">
                    {`${Options.Adult} Adultes . ${Options.Children} enfant . ${Options.room} chambre`}
                </span>
                {openoptions && (
                    <div className="option bg-blue text-white absolute start-0 top-11 rounded-lg p-8 w-md z-50">
                        {/* Adults, Children, and Rooms inputs */}
                        <div className="optionItem my-4 flex items-center justify-between">
                            <p>Adultes</p>
                            <div>
                                <button className='bg-primary' onClick={() => handleClick('Adult', 'decrease', 1)}>-</button>
                                <input className='max-w-10 bg-transparent ps-4 outline-none' type="text" readOnly value={Options.Adult} />
                                <button className='bg-secondary' onClick={() => handleClick('Adult', 'increase', 1)}>+</button>
                            </div>
                        </div>
                        <div className="optionItem my-4 flex items-center justify-between">
                            <p>Enfants</p>
                            <div>
                                <button className='bg-secondary' onClick={() => handleClick('Children', 'decrease', 0)}>-</button>
                                <input className='max-w-10 ps-4 outline-none bg-transparent' type="text" readOnly value={Options.Children} />
                                <button className='bg-primary' onClick={() => handleClick('Children', 'increase', 0)}>+</button>
                            </div>
                        </div>
                        <div className="optionItem my-4 flex items-center justify-between gap-10">
                            <p>Chambres</p>
                            <div className='flex justify-between'>
                                <button className='bg-primary' onClick={() => handleClick('room', 'decrease', 1)}>-</button>
                                <input className='max-w-10 ps-4 outline-none bg-transparent' type="text" readOnly value={Options.room} />
                                <button className='bg-secondary' onClick={() => handleClick('room', 'increase', 1)}>+</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Search Button */}
            <button className="w-full bg-blue mt-14 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300" onClick={handleSearch}>
                Rechercher
            </button>
        </div>
    );
};
