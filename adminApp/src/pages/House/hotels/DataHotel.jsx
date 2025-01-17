import React, { useContext, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import moment from "moment";
import axios from "axios";
import { FaEye, FaTrashAlt, FaEdit } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../../context/AuthContect";

const Hotels = () => {

    const { user } = useContext(AuthContext);
    const { adminHotes, adminUsers, _id } = user;
    let helpApi = `/`
    if (adminHotes) {
        helpApi = `/api/hotels/${_id}`
    }
    if (adminUsers) {
        helpApi = `/api/hotels`
    }



    const { data: fetchedData, loading, error } = useFetch(helpApi);
    console.log(fetchedData)
    const [data, setData] = useState([]);
    const [typeFilter, setTypeFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    useEffect(() => {
        const savedFilter = localStorage.getItem("typeFilter");
        if (savedFilter) {
            setTypeFilter(savedFilter);
        }
    }, []);

    // Handle change and save to localStorage
    const handleTypeChange = (event) => {
        const selectedValue = event.target.value;
        setTypeFilter(selectedValue);
        localStorage.setItem("typeFilter", selectedValue); // Save the value to localStorage
    };


    useEffect(() => {
        if (fetchedData) {
            console.log(fetchedData)
            const transformedData = fetchedData.map((item) => ({
                isA: item.isA,
                id: item._id,
                _id: item._id,
                name: item?.name || "N/A",
                type: item?.type || "N/A",
                city: item?.location.city || "N/A",
                neighborhood: item?.location?.neighborhood || "N/A",
                phone: item?.contact?.phone || "N/A",
                bookPhone: item?.contact?.bookPhone || "N/A",
                status: item.status || "N/A",
                price: item.basePrice || "N/A",
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                originalData: item,
            }));

            setData(
                typeFilter === "all"
                    ? transformedData
                    : transformedData.filter(
                        (item) => item.type.toLowerCase() === typeFilter.toLowerCase()
                    )
            );
        }
    }, [fetchedData, typeFilter]);

    if (error) {
        return (
            <div className="p-6 flex-[6]">
                <div className="text-red-500">
                    Error loading hotels: {error.message}
                </div>
            </div>
        );
    }

    const handleStatusChange = async () => {
        try {
            const response = await axios.put(`/api/hotels/${selectedHotel._id}`, {
                status: newStatus,
            });

            if (response.status === 200) {
                // Update local state with the new status
                setData((prevData) =>
                    prevData.map((item) =>
                        item._id === selectedHotel._id
                            ? { ...item, status: newStatus }
                            : item
                    )
                );
                setShowModal(false);
                setSelectedHotel(null);
            } else {
                throw new Error("Failed to update status");
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status. Please try again.");
        }
    };

    const handleOpenModal = (hotel) => {
        setSelectedHotel(hotel);
        setNewStatus(hotel.status);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/hotels/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete hotel: ${response.statusText}`);
            }

            setData((prevData) => prevData.filter((item) => item._id !== id));
        } catch (err) {
            console.error("Error deleting hotel:", err);
            alert("Failed to delete hotel. Please try again later.");
        }
    };

    const hotelColumns = [
        {
            field: "_id",
            headerName: "ID",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "isA",
            headerName: "IDAdmin",
            width: 150,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "name",
            headerName: "Hotel Name",
            flex: 1,
            // minWidth: 150,
            headerAlign: "left",
        },
        {
            field: "type",
            headerName: "Type",
            width: 100,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "city",
            headerName: "City",
            flex: 1,
            // minWidth: 120,
        },
        {
            field: "neighborhood",
            headerName: "Neighborhood",
            flex: 1.5,
            // minWidth: 150,
        },
        {
            field: "phone",
            headerName: "Phone",
            flex: 1.5,
            // minWidth: 150,
        },
        {
            field: "bookPhone",
            headerName: "BookPhone",
            flex: 1.5,
            // minWidth: 150,
        },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            renderCell: (params) => (
                <div className="flex justify-between items-center">
                    {/* <span>{params.row.status}</span> */}
                    <button
                        className="text-cyan-400 "
                        onClick={() => handleOpenModal(params.row)}
                    >
                        {params.row.status}
                    </button>
                </div>
            ),
        },
        {
            field: "price",
            headerName: "Price",
            width: 100,
        },
        {
            field: "createdAt",
            headerName: "Created At",
            width: 160,
            renderCell: (params) =>
                moment(params.row.createdAt).startOf().fromNow(),
        },
        {
            field: "updatedAt",
            headerName: "Updated At",
            width: 160,
            renderCell: (params) =>
                moment(params.row.updatedAt).startOf().fromNow(),
        },
    ];

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 150,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <div className="flex gap-4">
                    <Link to={`/hotels/find/${params.row._id}`}>
                        <FaEye className="w-5 h-5 text-blue-600 hover:text-blue-700 cursor-pointer" />
                    </Link>
                    <FaTrashAlt
                        className="w-5 h-5 text-red-600 hover:text-red-700 cursor-pointer"
                        onClick={() =>
                            window.confirm("Are you sure you want to delete this hotel?") &&
                            handleDelete(params.row._id)
                        }
                    />
                    <Link to={`/hotels/update/${params.row._id}`}>
                        <FaEdit className="w-5 h-5 text-gray-600 hover:text-gray-700 cursor-pointer" />
                    </Link>
                </div>
            ),
        },
    ];
    return (
        <div className={`mb-8 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-[calc(100vw-100px)] `}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faTable} className="mr-3 text-indigo-600" />
                    Hotels List
                </h3>
                <Link to="/hotels/new" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Hotel
                </Link>
            </div>

            <div className="mb-4">
                <select
                    value={typeFilter}
                    onChange={handleTypeChange}
                    className="p-2 border rounded-md"
                >
                    <option value="all">All Types</option>
                    <option value="hotel">Hotel</option>
                    <option value="apartment">Apartment</option>
                    <option value="resort">Resort</option>
                    <option value="villa">Villa</option>
                    <option value="cabin">Cabin</option>
                </select>
            </div>

            <div style={{ height: 700, width: '100%' }}>
                <DataGrid
                    style={{ fontSize: "11px" }}
                    rows={data}
                    columns={[...hotelColumns, ...actionColumn]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                    loading={loading}
                />
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl mb-4">Update Status</h2>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="p-2 border rounded-md mb-4"
                        >
                            <option value="disponible">Disponible</option>
                            <option value="booked">Booked</option>
                            <option value="en mantenimiento">En Mantenimiento</option>
                        </select>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusChange}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hotels;
