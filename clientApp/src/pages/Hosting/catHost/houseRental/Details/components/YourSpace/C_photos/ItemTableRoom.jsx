import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Grid, List } from 'lucide-react';
import { RoomCard } from './CardRoom';
import { ConfirmModal } from './DetailRoom';

// Room Table Component
export const RoomTable = ({ room, onEdit, onDelete, onClick }) => {
    return (
        <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => onClick(room?._id)}>
            <td className="px-4 py-3 border-b">
                <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-md overflow-hidden">
                        <img
                            src={room?.photos && room?.photos?.length > 0 ? room?.photos[0].url : '/api/placeholder/100/100'}
                            alt={room?.type}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">{room?.type}</p>
                        <p className="text-xs text-gray-500">{room?.floor !== undefined ? `Floor ${room?.floor}` : ''}</p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3 border-b">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${room?.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {room?.isAvailable ? 'Available' : 'Unavailable'}
                </span>
            </td>
            <td className="px-4 py-3 border-b text-gray-800">{room?.capacity} Guests</td>
            <td className="px-4 py-3 border-b text-gray-800">{room?.bathrooms?.length || 0}</td>
            <td className="px-4 py-3 border-b font-medium text-gray-800">${room?.price}</td>
            <td className="px-4 py-3 border-b">
                <div className="flex space-x-2 justify-end">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(room, true);
                        }}
                        className="p-1.5 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        aria-label="Edit Room"
                    >
                        <Edit2 size={16} className="text-blue-600" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(room?._id);
                        }}
                        className="p-1.5 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                        aria-label="Delete Room"
                    >
                        <Trash2 size={16} className="text-red-500" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

// Main component with display toggle
export const RoomDisplay = ({ data, handleSingleRoom, handleEditRoom, handleDelete, openConfirmDelete , setOpenConfirmDelete}) => {
    const [displayMode, setDisplayMode] = useState(() => {
        const savedMode = localStorage.getItem('roomDisplayMode');
        return savedMode || 'grid';
    });
    useEffect(() => {
        localStorage.setItem('roomDisplayMode', displayMode);
      }, [displayMode]);

    const [roomDataID, setRoomDataID] = useState(null);

    const show = (roomId) => {
        setRoomDataID(roomId);
        setOpenConfirmDelete(true);
    };

    const close = () => {
        setOpenConfirmDelete(false);
    };

    const toggleDisplayMode = (mode) => {
        setDisplayMode(mode);
    };

    return (
        <div className="space-y-6">
            {/* Toggle buttons */}
            <div className="flex justify-end mb-4">
                <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                    <button
                        className={`p-2 rounded-md flex items-center ${displayMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                        onClick={() => toggleDisplayMode('grid')}
                        aria-label="Show as cards"
                    >
                        <Grid size={16} className="mr-1" /> Cards
                    </button>
                    <button
                        className={`p-2 rounded-md flex items-center ${displayMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                        onClick={() => toggleDisplayMode('table')}
                        aria-label="Show as list"
                    >
                        <List size={16} className="mr-1" /> List
                    </button>
                </div>
            </div>

            {/* Grid/Card View */}
            {displayMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-5">
                    {data?.map((room) => (
                        <RoomCard
                            key={room._id}
                            room={room}
                            onClick={handleSingleRoom}
                            onDelete={show}
                            onEdit={handleEditRoom}
                        />
                    ))}
                </div>
            )}

            {/* Table View */}
            {displayMode === 'table' && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bathrooms</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.map((room) => (
                                <RoomTable
                                    key={room._id}
                                    room={room}
                                    onClick={handleSingleRoom}
                                    onDelete={show}
                                    onEdit={handleEditRoom}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Shared Confirm Modal */}
            <ConfirmModal
                message="Are you sure you want to delete this room?"
                id={roomDataID}
                isOpen={openConfirmDelete}
                onClose={close}
                onConfirm={handleDelete}
            />
        </div>
    );
};
