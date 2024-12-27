import React, { useState, useEffect } from 'react';

const RoomModal = ({ isOpen, onClose, roomData, mode, hotelId }) => {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        maxPeople: '',
        desc: '',
        roomNumbers: []
    });

    useEffect(() => {
        if (roomData) {
            setFormData({
                title: roomData.title || '',
                price: roomData.price || '',
                maxPeople: roomData.maxPeople || '',
                desc: roomData.desc || '',
                roomNumbers: roomData.roomNumbers || []
            });
        }
    }, [roomData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">
                    {mode === 'edit' ? 'Edit Room' : 'Add New Room'}
                </h2>
                {/* Add your form fields here */}
                <form>
                    {/* Form implementation */}
                </form>
            </div>
        </div>
    );
};

export default RoomModal; 