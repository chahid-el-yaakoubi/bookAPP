import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import RoomForm from "./AddRoom";
import axios from "axios";
import useFetch from "../../../../../../../../hooks/useFetch";
import { RoomDisplay } from "./ItemTableRoom";
import { RoomDetail } from "./DetailRoom";
import { useSelector } from "react-redux";
import { createRoom } from "../../../../../../../../Lib/api";

const RoomLayout = ({ job }) => {
    const { id } = useParams();
    const location = useLocation();
    const newPath = location.pathname;
    const navigate = useNavigate();
    const selectedProperty = useSelector(state => state.property.selectedProperty);

    

    console.log(selectedProperty)
    const [openConfirmDelete, setopenConfirmDelete] = useState(false);
    const [dataRoomEdit, setDataRoomEdit] = useState({});
    const [typeProperty, settypeProperty] = useState('');

    useEffect(()=>{
        if(selectedProperty){
            settypeProperty(selectedProperty?.type?.type)
        }
    }, [selectedProperty])


    const { data, error, reFetch } = useFetch(`/api/rooms/${id}/find`)
 

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
        const response = await createRoom( id , formData)

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
            alert('Room deleted successfully');
            setopenConfirmDelete(false)

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
        handleDelete(id);
        setopenConfirmDelete(true)

    }

    return (
        <>
            {job === "singleRoom" ? (
                <RoomDetail onBack={handleBack} onEdit={handleEditRoom} />
            ) : (
                <div>
                    {job === "add" ? (
                        <RoomForm onSubmit={handleSubmit} onCancel={handleBack} typeProperty={typeProperty} />
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
                                    openConfirmDelete ={openConfirmDelete}
                                    setOpenConfirmDelete={setopenConfirmDelete}

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
