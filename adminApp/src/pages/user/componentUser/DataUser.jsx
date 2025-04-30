// App.jsx

import React, { useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState } from "react";
import useFetch from '../../../hooks/useFetch';
import moment from 'moment';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';
 
 



const DataUser = (props) => {
  

    const { data: fetchedData, loading, error } = useFetch(`/api/users`);
    // console.log(fetchedData);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (fetchedData) {
            setData(fetchedData);
        }
    }, [fetchedData]);

    const filteredData = data.filter((user) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            user.username?.toLowerCase().includes(searchLower) ||
            user.fullName?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower)
        );
    });

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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`/api/users/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setData(data.filter((item) => item._id !== id));
                    alert("User deleted successfully!");
                } else {
                    alert("Error deleting user");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Error deleting user");
            }
        }
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
        <div className={`my-2 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-[calc(100vw-110px)]`}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2 className="text-xl font-semibold mb-4 md:mb-0">Users List</h2>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search by name, username, or email..."
                        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Link to="/users/new" className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center">
                        Ajouter utilisateur
                    </Link>
                </div>
            </div>
            <div style={{ height: 800, width: '100%' }}>
                <DataGrid style={{ fontSize: "11px"}}
                    rows={filteredData}
                    columns={userColumns.concat(actionColumn)}
                    getRowId={(row) => row._id.$oid || row._id}
                    loading={loading}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    pagination
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </div>
    );
};

export default DataUser;
