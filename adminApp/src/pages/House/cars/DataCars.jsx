import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import moment from "moment";
import axios from "axios";
import { FaEye, FaTrashAlt, FaEdit } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../../context/AuthContect";

const DataCars = ({ sideOpen }) => {
    const { user } = useContext(AuthContext);
    const { adminCars, adminUsers, username } = user;
    let helpApi = `/api/cars/${username}`;
    if (adminUsers) {
        helpApi = `/api/cars`;
    }

    const { data: fetchedData, loading, error , reFetch} = useFetch(helpApi);

   
    const [data, setData] = useState([]); 
    const POLLING_INTERVAL = 10000; // Poll every 5 seconds
    const [typeFilter, setTypeFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    useEffect(() => {
        const savedFilter = localStorage.getItem("carTypeFilter");
        if (savedFilter) {
            setTypeFilter(savedFilter);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            reFetch(); // Call the reFetch function to refresh data
        }, POLLING_INTERVAL);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [reFetch]); // Dependency array includes reFetch to avoid stale closures

    const handleTypeChange = (event) => {
        const selectedValue = event.target.value;
        setTypeFilter(selectedValue);
        localStorage.setItem("carTypeFilter", selectedValue);
    };

    useEffect(() => {
        if (fetchedData) {
            const transformedData = fetchedData.map((item, i) => ({
                count: i + 1,
                isA: item.isA,
                firstImage: item.photos && item.photos.length > 0 ? item.photos[0] : null, // Include the first image URL

                id: item._id,
                _id: item._id,
                carMake: item?.carDetails?.carMake || "N/A",
                carModel: item?.carDetails?.carModel || "N/A",
                city: item.location?.city || "N/A",
                neighborhood: item.location?.neighborhood || "N/A",
                price: item.price || "N/A",
                autoManual: item.autoManual || "N/A",
                fuelType: item.fuel?.type || "N/A",
                status: item.status || "N/A",
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                originalData: item,
                type: item.type || "N/A", // Ensure the type field is included
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

    const handleStatusChange = async () => {
        try {
            const response = await axios.put(`/api/cars/${selectedCar._id}`, {
                'status': newStatus,
            });
            if (response.status === 200) {
                setData((prevData) =>
                    prevData.map((item) =>
                        item._id === selectedCar._id
                            ? { ...item, status: newStatus }
                            : item
                    )
                );
                setShowModal(false);
                setSelectedCar(null);
            } else {
                throw new Error("Failed to update status");
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = confirm("Are you sure you want to delete this car?");
        if (!isConfirmed) {
            return; // Exit the function if the user cancels
        }
        try {
            await axios.delete(`/api/cars/${id}`);
            setData((prevData) => prevData.filter((item) => item._id !== id));
        } catch (err) {
            console.error("Error deleting car:", err);
            alert("Failed to delete car. Please try again.");
        }
    };

    const columns = [
        {
            field: "count",
            headerName: "Count",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "_id",
            headerName: "ID",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "firstImage",
            headerName: "Image",
            renderCell: (params) => (
                params.row.firstImage ? <img src={params.row.firstImage} alt="Car" style={{ width: '100%', height: 'auto' }} /> : 'N/A'
            ),
        },
        {
            field: "carMake",
            headerName: "carMake",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "carModel",
            headerName: "carModel",
        },
        {
            field: "city",
            headerName: "City",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "neighborhood",
            headerName: "Neighborhood",
        },
        {
            field: "price",
            headerName: "Price (USD)",
            renderCell: (params) => `${params.row.price} MAD`,
        },
        {
            field: "fuelType",
            headerName: "Fuel Type",
        },
        {
            field: "autoManual",
            headerName: "AutoManual",
        },
        {
            field: "status",
            headerName: "Status",
            renderCell: (params) => (
                <button
                    className="text-cyan-400"
                    onClick={() => (
                        setShowModal(true),
                        setSelectedCar(params.row)
                    )}
                >
                    {params.row.status}
                </button>
            ),
        },
        {
            field: "createdAt",
            headerName: "Created",
            width: 130,
            renderCell: (params) =>
                moment(params.row.createdAt).startOf().fromNow(),
        },
        {
            field: "updatedAt",
            headerName: "Updated",
            width: 130,
            renderCell: (params) =>
                moment(params.row.updatedAt).startOf().fromNow(),
        },
        {
            field: "action",
            headerName: "Actions",
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <div className="flex gap-4">
                    <Link to={`/cars/single/${params.row._id}`}>
                        <FaEye className="w-5 h-5 text-blue-600 hover:text-blue-700 cursor-pointer" />
                    </Link>
                    <FaTrashAlt
                        className="w-5 h-5 text-red-600 hover:text-red-700 cursor-pointer"
                        onClick={() => handleDelete(params.row._id)}
                    />
                    <Link to={`/cars/edit/${params.row._id}`}>
                        <FaEdit className="w-5 h-5 text-gray-600 hover:text-gray-700 cursor-pointer" />
                    </Link>
                </div>
            ),
        },
    ];

    if (adminUsers) {
        columns.splice(1, 0, {
            field: "isA",
            headerName: "IDAdmin",
            headerAlign: "center",
            align: "center",
        });
    }

    return (
        <div className={`mb-8 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${sideOpen ? 'w-[calc(100vw-280px)]' : 'w-[calc(100vw-100px)]'
            }`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faTable} className="mr-3 text-indigo-600" />
                    Cars List
                </h3>
                <Link to="/cars/new" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Car
                </Link>
            </div>
            <div className="mb-4">
                <select
                    value={typeFilter}
                    onChange={handleTypeChange}
                    className="p-2 border rounded-md"
                >
                    <option value="all">All Types</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Economy">Economy</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                </select>
            </div>
            <div style={{ height: 700, width: '100%' }}>
                <DataGrid
                    style={{ fontSize: "11px" }}
                    rows={data}
                    columns={columns}
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl mb-4">Update Status</h2>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="p-2 border rounded-md mb-4"
                        >
                            <option value="available">Available</option>
                            <option value="rented">Rented</option>
                            <option value="maintenance">Under Maintenance</option>
                            <option value="reserved">Reserved</option>
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

export default DataCars;
  
