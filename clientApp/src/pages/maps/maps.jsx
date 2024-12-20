import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Maps = () => {
  const [selectedDates, setSelectedDates] = useState({
    checkIn: null,
    checkOut: null,
  });

  return (
    <div className="flex h-screen">
      {/* Left sidebar - Search and Filters */}
      <div className="w-1/3 p-4 overflow-y-auto border-r">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search location..."
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Date picker */}
        <div className="mb-6 space-y-2">
          <h3 className="font-semibold">Dates</h3>
          <div className="flex gap-2">
            <DatePicker
              selected={selectedDates.checkIn}
              onChange={(date) => setSelectedDates({ ...selectedDates, checkIn: date })}
              placeholderText="Check-in"
              className="w-full p-2 border rounded-lg"
            />
            <DatePicker
              selected={selectedDates.checkOut}
              onChange={(date) => setSelectedDates({ ...selectedDates, checkOut: date })}
              placeholderText="Check-out"
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Property listings */}
        <div className="space-y-4">
          {/* Example property card */}
          <div className="p-4 border rounded-lg">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Property"
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
            <h3 className="font-semibold">Luxury Apartment</h3>
            <p className="text-gray-600">$200/night</p>
            <div className="flex items-center text-sm text-gray-500">
              <span>2 beds • 2 baths • 4 guests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Map */}
      <div className="w-2/3">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1649436416029!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Maps;
