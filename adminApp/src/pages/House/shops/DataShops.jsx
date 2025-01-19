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



const DataShops = ({sideOpen}) => {

    const { user } = useContext(AuthContext);
    const { adminShops, adminUsers, _id } = user;
    let helpApi = `/`
    if (adminShops) {
        helpApi = `/api/shops/${_id}`
    }
    if (adminUsers) {
        helpApi = `/api/shops`
    }

    const { data: fetchedData, loading, error } = useFetch(helpApi);
    const [data, setData] = useState([]);
    const [typeFilter, setTypeFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [count, setCount] = useState(0);
    useEffect(() => {
        const savedFilter = localStorage.getItem("houseTypeFilter");
        if (savedFilter) {
            setTypeFilter(savedFilter);
        }
    }, []);



    const handleTypeChange = (event) => {
        const selectedValue = event.target.value;
        setTypeFilter(selectedValue);
        localStorage.setItem("houseTypeFilter", selectedValue);
    };



    useEffect(() => {
        if (fetchedData) {
            const transformedData = fetchedData.map((item, i) => ({
                count: i+1,
                id: item._id,
                _id: item._id,
                name: item?.shopName || "N/A",
                type: item?.type || "N/A",
                status: item?.status || "N/A",
                city: item.location?.city || "N/A",
                neighborhood: item.location?.neighborhood || "N/A",
                phone: item.contact?.phone || "N/A",
                email: item.email || "N/A",
                whatsapp: item?.contactNumber || "N/A",
                price: item?.price || "N/A",
                size: item?.area || "N/A",
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

    const handleStatusChange = async () => {
        try {
            const response = await axios.put(`/api/shops/${selectedHouse._id}`, {
                'status': newStatus,
            });


            if (response.status === 200) {
                setData((prevData) =>
                    prevData.map((item) =>
                        item._id === selectedHouse._id
                            ? { ...item, status: newStatus }
                            : item
                    )
                );
                setShowModal(false);
                setSelectedHouse(null);
            } else {
                throw new Error("Failed to update status");
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status. Please try again.");
        }
    };

    const handleDelete = async (id

    ) => {
        const isConfirmed = confirm("Are you sure you want to delete this house?");
        if (!isConfirmed) {
            return; // Exit the function if the user cancels
        }
    
        try {
            await axios.delete(`/api/shops/${id}`);
            setData((prevData) => prevData.filter((item) => item._id !== id));
        } catch (err) {
            console.error("Error deleting house:", err);
           
    
     alert("Failed to delete house. Please try again.");
        }
    };
    
    const columns = [
        {
            field: "count",
            headerName: "count",
            // width: 200,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "_id",
            headerName: "ID",
            width: 200,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
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
            field: "status",
            headerName: "Status",
            width: 120,
            renderCell: (params) => (
                <button
                    className="text-cyan-400"
                    onClick={() => (
                        setShowModal(true),
                        setSelectedHouse(params.row)
                    )   }
                >
                    {params.row.status}
                </button>
            ),
        },
        {
            field: "city",
            headerName: "City",
            width: 120,
        },
        {
            field: "neighborhood",
            headerName: "Neighborhood",
            width: 150,
        },
        {
            field: "price",
            headerName: "Price",
            width: 100,
            renderCell: (params) => `${params.row.price} MAD`,
        },
        {
            field: "specifications",
            headerName: "Specs",
            width: 150,
            renderCell: (params) => (
                `${params.row.size}m²`
            ),
        },
        {
            field: "contact",
            headerName: "Contact",
            width: 200,
            renderCell: (params) => (
                <div className="text-xs">
                    <div>📞 {params.row.phone}</div>
                    <div>📱 {params.row.whatsapp}</div>
                </div>
            ),
        },
        {
            field: "createdAt",
            headerName: "Created",
            width: 130,
            renderCell: (params) =>
                moment(params.row.createdAt).format('DD/MM/YYYY'),
        },
        {
            field: "updatedAt",
            headerName: "Updated",
            width: 130,
            renderCell: (params) =>
                moment(params.row.createdAt).format('DD/MM/YYYY'),
        },
        {
            field: "action",
            headerName: "Actions",
            width: 150,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <div className="flex gap-4">
                    <Link to={`/shops/single/${params.row._id}`}>
                        <FaEye className="w-5 h-5 text-blue-600 hover:text-blue-700 cursor-pointer" />
                    </Link>
                    <FaTrashAlt
                        className="w-5 h-5 text-red-600 hover:text-red-700 cursor-pointer"
                        onClick={() => handleDelete(params.row._id)}
                    />
                    <Link to={`/shops/edit/${params.row._id}`}>
                        <FaEdit className="w-5 h-5 text-gray-600 hover:text-gray-700 cursor-pointer" />
                    </Link>
                </div>
            ),
        },
    ];

    // ... rest of the component (handleDelete, handleOpenModal, etc.) remains the same

    return (
        <div className={`mb-8 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${
            sideOpen ? 'w-[calc(100vw-280px)]' : 'w-[calc(100vw-100px)]'
        }`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faTable} className="mr-3 text-indigo-600" />
                    Properties List
                </h3>
                <Link to="/shops/new" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Property
                </Link>
            </div>

            <div className="mb-4">
                <select
                    value={typeFilter}
                    onChange={handleTypeChange}
                    className="p-2 border rounded-md"
                >
                    <option value="all">All Types</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="riad">Riad</option>
                    <option value="studio">Studio</option>
                </select>
            </div>

            <div style={{ height: 700, width: '100%' }}>
                <DataGrid 
                    style={{fontSize: "11px"}}
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

export default DataShops; 