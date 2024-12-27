import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable, faPlus, faTrash, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { DataGrid } from '@mui/x-data-grid';
import useFetch from '../../../hooks/useFetch';
import SingleRoom from './SingleRoom';
// import SingleRoom from '../../../components/SingleRoom';

const DataRoom = ({ hotelId, setIsModalOpen, updateRooms, onEditRoom, setRoomFormData }) => {

    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const { data: roomData, loading: roomsLoading, error: roomsError } = useFetch(`/api/rooms?hotelId=${hotelId}`);

    useEffect(() => {
        setRooms(roomData || []);
    }, [roomData]);

    const handleDelete = async (roomId) => {
        if (window.confirm('Are you sure you want to delete this room?')) {

            
            try {
                const response = await fetch(`/api/rooms/${roomId}/${hotelId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    setRooms(rooms.filter(room => room._id !== roomId));
                    if (updateRooms) {
                        updateRooms();
                    }
                } else {
                    throw new Error('Failed to delete room');
                }
            } catch (err) {
                console.error('Error deleting room:', err);
            }
        }
    };

    const handleEdit = (room) => {
        setIsModalOpen({ isOpen: true});
        setRoomFormData(room) ;
        onEditRoom(room);
    };

    const handleShowDetails = (room) => {
        setSelectedRoom(room);
    };

    const handleCloseDetails = () => {
        setSelectedRoom(null);
    };

    if (!Array.isArray(rooms)) {
        return <div>No rooms data available</div>;
    }

    const columns = [
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'price', headerName: 'Price', flex: 1, 
          renderCell: (params) => `$${params.value}` },
        { field: 'maxPeople', headerName: 'Max People', flex: 1 },
        { field: 'area', headerName: 'Area', flex: 1 },

        { 
            field: 'roomNumber', 
            headerName: 'Room Numbers', 
            flex: 1.5,
            renderCell: (params) => {
                if (!params.value || !Array.isArray(params.value)) {
                    return 'No room numbers';
                }
                
                const uniqueRooms = Array.from(new Set(params.value.map(rn => rn.number)))
                    .sort((a, b) => a - b);
                
                return uniqueRooms.map(number => {
                    const roomInfo = params.value.find(rn => rn.number === number);
                    const needsUpdate = roomInfo.unavailableDates?.length > 0;
                    return (
                        <span 
                            key={number}
                            className={`inline-block px-2 py-1 m-1 rounded-full text-sm relative
                                ${needsUpdate 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-green-100 text-green-800'}`}
                        >
                            {number}
                            {needsUpdate && (
                                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" 
                                      title="Needs update"></span>
                            )}
                        </span>
                    );
                });
            }
        },
        { field: 'desc', headerName: 'Description', flex: 2 },
        {
            field: 'amenities',
            headerName: 'Amenities',
            flex: 1,
            renderCell: (params) => (
                <div className="text-gray-800">
                    {params.row.amenities.length}
                </div>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleDelete(params.row._id)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        title="Delete Room"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                        onClick={() => handleEdit(params.row)}
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                        title="Edit Room"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                        onClick={() => handleShowDetails(params.row)}
                        className="text-green-600 hover:text-green-900 transition-colors duration-200"
                        title="Show Room Details"
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faTable} className="mr-3 text-indigo-600" />
                    Hotel Rooms
                </h3>
                <button
                    onClick={() => setIsModalOpen({ isOpen: true, roomData: null })}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Room
                </button>
            </div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    getRowId={(row) => row._id}
                    rows={rooms}
                    columns={columns}
                    initialState={{
                        pagination: {
                            pageSize: 100,
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
                    autoHeight
                />
            </div>
            {selectedRoom && (
                <div className="mt-4">
                    <SingleRoom room={selectedRoom} onClose={handleCloseDetails} />
                    
                </div>
            )}
        </div>
    );
};

export default DataRoom;