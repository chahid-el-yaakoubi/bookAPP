import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import moment from "moment";
import axios from "axios";
import { FaEye, FaTrashAlt, FaEdit } from "react-icons/fa";

const Hotels = ({sideOpen}) => {

    
    const { data: fetchedData, loading, error } = useFetch(`/api/hotels`);
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
            const transformedData = fetchedData.map((item) => ({
                id: item._id,
                _id: item._id,
                name: item?.name || "N/A",
                type: item?.type || "N/A",
                city: item?.location.city || "N/A",
                address: item?.location?.address || "N/A",
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
            field: "address",
            headerName: "Address",
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
        <div style={{ fontSize: "12px" }} className={`p-2 sm:p-4 md:p-6 w-auto  mx-auto  h-[100vh]`}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Hotels List</h2>

                <div>
                    <select
                        id="countries"
                        value={typeFilter}
                        onChange={handleTypeChange} // Use a proper handler function
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option value="all">ALL</option>
                        <option value="hotel">HOTELS</option>
                        <option value="villa">VILLAS</option>
                        <option value="house">HOUSES</option>
                        <option value="studio">STUDIO</option>
                    </select>
                </div>
                <Link
                    to="/hotels/new"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add New Hotel
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow-sm ">
                <DataGrid style={{ fontSize: "11px", width: "100%" }}
                    rows={data}
                    columns={hotelColumns.concat(actionColumn)}
                    getRowId={(row) => row._id}
                    loading={loading}
                    pageSizeOptions={[10, 25, 50]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Change Status</h3>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mb-4"
                        >
                            <option value="available">Available</option>
                            <option value="booked">Booked</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={handleStatusChange}
                            >
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hotels;
