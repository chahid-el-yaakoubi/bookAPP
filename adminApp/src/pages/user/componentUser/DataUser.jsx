// App.jsx

import React, { useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState } from "react";
import useFetch from '../../../hooks/useFetch';
import moment from 'moment';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';

const DataUser = () => {
    const { data: fetchedData, loading, error } = useFetch(`/api/users`);
    // console.log(fetchedData);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (fetchedData) {
            setData(fetchedData);
        }
    }, [fetchedData]);

    const userColumns = [
        { field: "_id", headerName: "ID", flex: 1, minWidth: 200 },
        { 
            field: "fullName", 
            headerName: "Nom et Prénom", 
            flex: 1,
            minWidth: 150
        },
        { field: "username", headerName: "Username", flex: 0.8, minWidth: 120 },
        { field: "email", headerName: "Email", flex: 1.2, minWidth: 180 },
        { field: "city", headerName: "Ville", flex: 0.8, minWidth: 100 },
        { 
            field: "createdAt", 
            headerName: "Date de création", 
            flex: 1,
            minWidth: 140,
            valueGetter: (params) => {
                const timestamp = params.row?.createdAt?.$date?.$numberLong;
                return timestamp ? moment(Number(timestamp)).fromNow() : 'N/A';
            }
        },
        { 
            field: "updatedAt", 
            headerName: "Date de mise à jour", 
            flex: 1,
            minWidth: 140,
            valueGetter: (params) => {
                const timestamp = params.row?.updatedAt?.$date?.$numberLong;
                return timestamp ? moment(Number(timestamp)).fromNow() : 'N/A';
            }
        },
    ];

    const handleDelete = (id) => {
        setData(data.filter((item) => item._id !== id));
    };

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => {
                return (
                    <div className="flex gap-3">
                        <Link to={`/users/find/${params.row._id}`}>
                            <FaEye className="text-blue-500 hover:text-blue-700 text-xl cursor-pointer" />
                        </Link>
                        <Link to={`/users/edit/${params.row._id}`}> 
                            <FaEdit className="text-green-500 hover:text-green-700 text-xl cursor-pointer" />
                        </Link>
                        <FaTrash
                            onClick={() => handleDelete(params.row._id)}
                            className="text-red-500 hover:text-red-700 text-xl cursor-pointer"
                        />
                    </div>
                );
            },
        },
    ];

    

    return (
        <div className="p-2 sm:p-4 md:p-6 max-w-[98vw]  md:max-w-[96vw]  mx-auto container-fluid h-[80vh] md:h-[80vh] overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2 className="text-xl font-semibold mb-4 md:mb-0">Users List</h2>
                <Link to="/users/new" className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center ">
                    Ajouter utilisateur
                </Link>
            </div>
            <div className=" bg-white rounded-lg shadow-sm h-[calc(90vh-100px)] md:h-[calc(80vh-80px)] w-full">
                <DataGrid
                    rows={data}
                    columns={userColumns.concat(actionColumn)}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                    getRowId={(row) => row._id.$oid || row._id}
                    loading={loading}
                   
                />
            </div>
        </div>
    );
};

export default DataUser;