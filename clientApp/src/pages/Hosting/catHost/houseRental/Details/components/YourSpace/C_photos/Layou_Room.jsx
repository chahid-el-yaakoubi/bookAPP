import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import RoomForm from "./AddRoom";
import axios from "axios";
import useFetch from "../../../../../../../../hooks/useFetch";
import { RoomDisplay } from "./ItemTableRoom";
import { RoomDetail } from "./DetailRoom";

const RoomLayout = ({ job }) => {
    const { id } = useParams();
    const location = useLocation();
    const newPath = location.pathname;
    const navigate = useNavigate();

    const [openConfirmDelete, setopenConfirmDelete] = useState(false);
    const [dataRoomEdit, setDataRoomEdit] = useState({});
    const [roomDataID, setRoomDataID] = useState(null);


    const { data, error, reFetch } = useFetch(`/api/rooms/${id}/find`)

    console.log(data);

    const initialRoomData = data[15] || [];

    const roomId = initialRoomData?._id






    const handleAddRoom = async () => {
        navigate(newPath + `/add`)
    }

    const handleEditRoom = async (room, id) => {

        setDataRoomEdit(room);
        const checkId = id ? `/${room._d}` : '';
        navigate(newPath + `${checkId}/edit`)
    }

    const handleSubmit = async (formData) => {
        console.log('Submitted Room Data:', formData);
        console.log(id)
        // Here you would typically send the data to your backend
        // For example:
        const response = await axios.post(`/api/rooms/${id}`, formData)

        if (response.status === 200) {
            // Successfully added room
            reFetch();
            alert('Room added successfully');
            handleBack()
        }

        // For now, just log and navigate
        // navigate('/rooms');
    };

    const handleUpdate = async (formData) => {
        console.log('Updated Room Data:', formData);
        // HereroomId
        const roomId = await formData?._id;


        // For example:
        const response = await axios.put(`/api/rooms/${roomId}`, formData)

        if (response.status === 200) {
            reFetch();
            alert('Room updated successfully');
            handleBack()
        }
    };

    const handleDelete = async (roomId) => {
        console.log('Deleting Room with ID:', roomId);
        // Here you would typically send a DELETE request to your backend
        // For example:
        const response = await axios.delete(`/api/rooms/${roomId}/${id}`);

        if (response.status === 200) {
            // Successfully deleted room
            reFetch()
            close();
            alert('Room deleted successfully');

        }
    }


    const handleSingleRoom = async (roomId) => {
        navigate(newPath + `/${roomId}`)

    }



    const handleBack = () => {
        navigate(-1);
        reFetch();
    }
    const show = (id) => {
        setRoomDataID(id);
        setopenConfirmDelete(true)
    }
    const close = () => {
        setopenConfirmDelete(false)
    }
    return (
        <>
            {job === "singleRoom" ? (
                <RoomDetail onBack={handleBack} onEdit={handleEditRoom} />
            ) : (
                <div>
                    {job === "add" ? (
                        <RoomForm onSubmit={handleSubmit} onCancel={handleBack} />
                    ) : job === "edit" ? (
                        <RoomForm
                            onSubmit={handleUpdate}
                            initialData={dataRoomEdit}
                            onCancel={handleBack}
                        />
                    ) : (
                        <div>
                            <button
                                className="flex items-center gap-2 bg-gray-400 rounded-md p-2 hover:scale-105"
                                onClick={handleAddRoom}
                            >
                                <FaPlus /> Add Room
                            </button>

                            <div>
                                <h1 className="text-4xl mt-6 ">Your Room Management</h1>
                                <RoomDisplay
                                    data={data}
                                    handleSingleRoom={handleSingleRoom}
                                    handleEditRoom={handleEditRoom}
                                    handleDelete={show}
                                />
                            </div>
                            
                        </div>


                    )}
                </div>
            )}
        </>

    );
};

export default RoomLayout;
