import React, { useState, useEffect } from 'react';
import { selectProperty, UPDATE_PROPERTY } from '../../../../../../../redux/actions/propertyActions'; // Update the path as needed
import { useSelector, useDispatch } from 'react-redux';
import { updateProperty } from '../../../../../../../Lib/api';

const Guests = () => {
  const dispatch = useDispatch();
  const selectedProperty = useSelector(state => state.property.selectedProperty);

  const [guestCount, setGuestCount] = useState(selectedProperty?.policies?.rules?.max_guests || 0);
  const [peopleWidths, setPeopleWidths] = useState([]);
  const maxGuests = 16;

  // Generate random widths whenever guest count changes
  useEffect(() => {
    const newWidths = Array(guestCount).fill(0).map(() =>
      8 + Math.floor(Math.random() * 6) // Width between 8-13px
    );
    setPeopleWidths(newWidths);
  }, [guestCount]);

  const handleGuestChange = async (newValue) => {
    const newCount = Math.min(Math.max(1, newValue), 16); // Allow up to 30 but display as 16+
    setGuestCount(newCount);

    // Create updated property object with the new title
    const updatedProperty = {
      policies: {
        ...selectedProperty.policies,
        rules: {
          ...selectedProperty.policies.rules,
          max_guests: newCount
        }
      }
    };



    const res = await updateProperty(selectedProperty?._id, updatedProperty);

    if (res.status === 200) {
      dispatch(selectProperty(res.data));

    }
  };

  // Creates a person SVG with given color and random width
  const PersonSvg = ({ color, height = 32, width, index }) => {
    // Slight variation in heights for visual interest
    const finalHeight = height - 2 + Math.floor(Math.random() * 4);

    return (
      <div key={index} className="mx-1 transition-all duration-300">
        <svg width={width} height={finalHeight} viewBox="0 0 12 24" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <circle cx="6" cy="4" r="3.5" fill={color} />

          {/* Body */}
          <rect x="3" y="8" width="6" height="12" rx="3" fill={color} />

          {/* Legs */}
          <rect x="3" y="20" width="2" height="8" fill={color} />
          <rect x="7" y="20" width="2" height="8" fill={color} />
        </svg>
      </div>
    );
  };

  // Render people icons based on current count
  const renderPeopleIcons = () => {
    const colors = [
      '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
      '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
      '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
      '#B366CC'
    ];

    // Limit display to max 16 icons
    const displayCount = Math.min(guestCount, maxGuests);
    const people = [];

    // Add person icons with random widths
    for (let i = 0; i < displayCount; i++) {
      const color = colors[i % colors.length];
      people.push(
        <PersonSvg
          key={i}
          color={color}
          height={24}
          width={peopleWidths[i] || 12}
          index={i}
        />
      );
    }

    return people;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="flex items-center justify-center mb-6 min-h-16">
        {renderPeopleIcons()}
      </div>

      <div className="text-center mb-8">
        <p className="text-gray-600">How many guests can fit comfortably in your space?</p>
      </div>

      <div className="flex items-center justify-center">
        <button
          onClick={() => handleGuestChange(guestCount - 1)}
          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:border-gray-400"
          aria-label="Decrease guests"
          disabled={guestCount <= 1}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="mx-6 flex items-baseline">
          <span className="text-6xl font-bold">{guestCount >= maxGuests ? '16' : guestCount}</span>
          {guestCount >= maxGuests && <span className="text-6xl font-bold">+</span>}
        </div>

        <button
          onClick={() => handleGuestChange(guestCount + 1)}
          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:border-gray-400"
          aria-label="Increase guests"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>

        </button>
      </div>
    </div>
  );
};

export default Guests;