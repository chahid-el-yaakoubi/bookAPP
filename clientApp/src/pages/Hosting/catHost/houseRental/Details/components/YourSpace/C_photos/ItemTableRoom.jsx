import React, { useEffect, useState, useMemo } from 'react';
import { Edit2, Trash2, Grid, List } from 'lucide-react';
import { RoomCard } from './CardRoom';
import { ConfirmModal } from './DetailRoom';

// Room Table Component
export const RoomTable = ({ room, onEdit, onDelete, onClick, onStatusChange }) => {
    const handleStatusChange = async (e) => {
        e.stopPropagation();
        const newStatus = e.target.value;
        try {
            await onStatusChange(room._id, newStatus);
        } catch (error) {
            console.error('Failed to update room status:', error);
            // Consider adding error handling UI feedback here
        }
    };

    const getStatusStyles = (status) => {
        const baseStyles = 'px-3 py-1.5 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1';
        const statusStyles = {
            available: 'bg-green-50 text-green-700 border border-green-200 focus:ring-green-200',
            booked: 'bg-blue-50 text-blue border border-blue/20 focus:ring-blue/30',
            maintenance: 'bg-yellow-50 text-yellow-700 border border-yellow-200 focus:ring-yellow-200'
        };
        return `${baseStyles} ${statusStyles[status] || statusStyles.available}`;
    };

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
                <select
                    value={room?.status || 'available'}
                    onChange={handleStatusChange}
                    onClick={(e) => e.stopPropagation()}
                    className={getStatusStyles(room?.status)}
                >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="maintenance">Maintenance</option>
                </select>
            </td>
            <td className="px-4 py-3 border-b text-gray-800">{room?.capacity} Guests</td>
            <td className="px-4 py-3 border-b text-gray-800">{room?.bathrooms?.length || 0}</td>
            <td className="px-4 py-3 border-b font-medium text-gray-800">MAD {room?.price}</td>
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
export const RoomDisplay = ({
    data,
    handleSingleRoom,
    handleEditRoom,
    handleDelete,
    openConfirmDelete,
    setOpenConfirmDelete,
    handleStatusChange
}) => {
    const [displayMode, setDisplayMode] = useState(() =>
        localStorage.getItem('roomDisplayMode') || 'grid'
    );
    const [statusFilter, setStatusFilter] = useState('all');
    const [roomDataID, setRoomDataID] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        localStorage.setItem('roomDisplayMode', displayMode);
    }, [displayMode]);

    const handleDeleteConfirmation = (roomId) => {
        setRoomDataID(roomId);
        setOpenConfirmDelete(true);
    };

    const handleCloseModal = () => {
        setOpenConfirmDelete(false);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredData = useMemo(() => {
        let result = data?.filter(room =>
            statusFilter === 'all' ? true : room.status === statusFilter
        );

        if (sortConfig.key) {
            result = [...result].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [data, statusFilter, sortConfig]);

    const getStatusCount = (status) => {
        if (status === 'all') return data?.length || 0;
        return data?.filter(room => room.status === status).length || 0;
    };

    const toggleDisplayMode = (mode) => {
        setDisplayMode(mode);
    };

    return (
        <div className="space-y-6 mt-6">


            {/* Filter and Toggle buttons */}
            <div className="flex justify-between items-center mb-4">
                {/* Status Filter Buttons */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {['all', 'available', 'maintenance', 'booked'].map((status) => {
                        const count = getStatusCount(status);

                        return (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                ${status === statusFilter
                                        ? 'bg-blue text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                            </button>
                        );
                    })}
                </div>

                <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                    <button
                        className={`p-2 rounded-md flex items-center ${displayMode === 'grid' ? 'bg-white shadow-sm text-blue' : 'text-gray-600'}`}
                        onClick={() => toggleDisplayMode('grid')}
                        aria-label="Show as cards"
                    >
                        <Grid size={16} className="mr-1" /> Cards
                    </button>
                    <button
                        className={`p-2 rounded-md flex items-center ${displayMode === 'table' ? 'bg-white shadow-sm text-blue' : 'text-gray-600'}`}
                        onClick={() => toggleDisplayMode('table')}
                        aria-label="Show as list"
                    >
                        <List size={16} className="mr-1" /> List
                    </button>
                </div>
            </div>

            {/* Grid View */}
            {displayMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedAndFilteredData?.map((room) => (
                        <RoomCard
                            key={room._id}
                            room={room}
                            onClick={handleSingleRoom}
                            onDelete={handleDeleteConfirmation}
                            onEdit={handleEditRoom}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}

            {/* Table View */}
            {displayMode === 'table' && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <div className="w-screen md:w-full h-[500px] overflow-y-auto">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th 
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap bg-gray-50"
                                        onClick={() => handleSort('type')}
                                    >
                                        Room {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                                        onClick={() => handleSort('status')}
                                    >
                                        Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                                        onClick={() => handleSort('capacity')}
                                    >
                                        Capacity {sortConfig.key === 'capacity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                                        onClick={() => handleSort('bathrooms')}
                                    >
                                        Bathrooms {sortConfig.key === 'bathrooms' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th 
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                                        onClick={() => handleSort('price')}
                                    >
                                        Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedAndFilteredData?.map((room) => (
                                    <RoomTable
                                        key={room._id}
                                        room={room}
                                        onClick={handleSingleRoom}
                                        onDelete={handleDeleteConfirmation}
                                        onEdit={handleEditRoom}
                                        onStatusChange={handleStatusChange}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Shared Confirm Modal */}
            <ConfirmModal
                message="Are you sure you want to delete this room?"
                id={roomDataID}
                isOpen={openConfirmDelete}
                onClose={handleCloseModal}
                onConfirm={handleDelete}
            />
        </div>
    );
};
