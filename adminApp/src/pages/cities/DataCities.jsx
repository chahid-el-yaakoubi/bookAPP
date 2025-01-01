// App.jsx

import React, { useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState } from "react";
import moment from 'moment';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';
import NewCity from "./NewCity";
import axios from 'axios';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const DataCities = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingCityId, setEditingCityId] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(
        localStorage.getItem('selectedRegion') || 'all'
    );
    const [selectedCity, setSelectedCity] = useState(
        localStorage.getItem('selectedCity') || 'all'
    );
    const [filteredData, setFilteredData] = useState([]);

    // Fetch cities
    const fetchCities = async () => {
        try {
            const response = await axios.get('/api/cities');
            setData(response.data);
        } catch (error) {
            alert("Failed to fetch cities");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        const cityToEdit = data.find(city => city._id === id);
        if (cityToEdit) {

            setIsEditOpen(true);
            setEditingCityId(id);
            handleNeighborsUpdated();
            
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        let filtered = [...data];
        
        if (selectedRegion !== 'all') {
            filtered = filtered.filter(city => city.region === selectedRegion);
        }
        
        if (selectedCity !== 'all') {
            filtered = filtered.filter(city => city.name === selectedCity);
        }
        
        setFilteredData(filtered);
    }, [data, selectedRegion, selectedCity]);

    const handleCityAdded = (newCity) => {
        setData(prev => [...prev, newCity]);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this city?")) {
            try {
                await axios.delete(`/api/cities/${id}`);
                setData(data.filter((item) => item._id !== id));
                alert("City deleted successfully!");
                handleNeighborsUpdated();
            } catch (error) {
                alert(error.response?.data?.message || "Error deleting city");
            }
        }
    };

    const handleNeighborsUpdated = () => {
        fetchCities();
    };

    const getUniqueRegions = () => {
        const regions = [...new Set(data.map(city => city.region))];
        return regions;
    };

    const getUniqueCities = () => {
        const cities = [...new Set(data.map(city => city.name))];
        return cities;
    };

    const cityColumns = [
        { 
            field: "_id", 
            headerName: "ID", 
            flex: 1, 
            minWidth: 150,
            hide: window.innerWidth < 768 
        },
        { 
            field: "name", 
            headerName: "City Name", 
            flex: 1,
            minWidth: 120
        },
        { 
            field: "region", 
            headerName: "Region", 
            flex: 1.2, 
            minWidth: 180 
        },
        { 
            field: "neighbors", 
            headerName: "Neighboring Cities", 
            flex: 1.2,
            minWidth: 180,
            renderCell: (params) => {
                return params.row.neighbors?.map(neighbor => neighbor.name).join(", ");
            }
        },
        { 
            field: "createdAt", 
            headerName: "Created", 
            flex: 1,
            minWidth: 140,
            valueGetter: (params) => {
                return params.row?.createdAt ? moment(params.row.createdAt).fromNow() : '';
            }
        },
        { 
            field: "updatedAt", 
            headerName: "Updated", 
            flex: 1,
            minWidth: 140,
            valueGetter: (params) => {
                return params.row?.updatedAt ? moment(params.row.updatedAt).fromNow() : '';
            }
        },
    ];

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => {
                return (
                    <div className="flex gap-3">
                        <Link to={`/cities/${params.row._id}`}>
                            <FaEye className="text-blue-500 hover:text-blue-700 text-xl cursor-pointer" />
                        </Link>
                        <button onClick={() => handleEdit(params.row._id)}> 
                            <FaEdit className="text-green-500 hover:text-green-700 text-xl cursor-pointer" />
                        </button>
                        <FaTrash
                            onClick={() => handleDelete(params.row._id)}
                            className="text-red-500 hover:text-red-700 text-xl cursor-pointer"
                        />
                    </div>
                );
            },
        },
    ];

    const handleRegionChange = (e) => {
        const value = e.target.value;
        setSelectedRegion(value);
        localStorage.setItem('selectedRegion', value);
    };

    const handleCityChange = (e) => {
        const value = e.target.value;
        setSelectedCity(value);
        localStorage.setItem('selectedCity', value);
    };

    return (
        <div className="p-2 sm:p-4 md:p-6 max-w-full mx-auto container-fluid h-[85vh] overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2 className="text-xl font-semibold mb-4 md:mb-0">Cities List</h2>
                <button 
                    onClick={() => setIsOpen(true)} 
                    className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center text-sm"
                >
                    Add City
                </button>
                <NewCity 
                    isOpen={isOpen} 
                    onClose={() => setIsOpen(false)} 
                    onCityAdded={handleCityAdded}
                    refetch={fetchCities}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <FormControl className="min-w-[200px]">
                    <InputLabel>Filter by Region</InputLabel>
                    <Select
                        value={selectedRegion}
                        label="Filter by Region"
                        onChange={handleRegionChange}
                    >
                        <MenuItem value="all">All Regions</MenuItem>
                        {getUniqueRegions().map((region) => (
                            <MenuItem key={region} value={region}>
                                {region}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl className="min-w-[200px]">
                    <InputLabel>Filter by City</InputLabel>
                    <Select
                        value={selectedCity}
                        label="Filter by City"
                        onChange={handleCityChange}
                    >
                        <MenuItem value="all">All Cities</MenuItem>
                        {getUniqueCities().map((city) => (
                            <MenuItem key={city} value={city}>
                                {city}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="bg-white rounded-lg shadow-sm h-[calc(100%-60px)] w-full">
                <DataGrid
                    style={{ 
                        fontSize: "12px",
                        width: '100%',
                        height: '100%'
                    }}
                    rows={filteredData.length > 0 ? filteredData : data}
                    columns={cityColumns.concat(actionColumn)}
                    getRowId={(row) => row._id}
                    loading={loading}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                        columns: {
                            columnVisibilityModel: {
                                _id: window.innerWidth >= 768,
                                updatedAt: window.innerWidth >= 768,
                                createdAt: window.innerWidth >= 768,
                            }
                        }
                    }}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    pagination
                    checkboxSelection
                    disableSelectionOnClick
                    autoHeight={false}
                />
            </div>
            
            {isEditOpen && (
                <NewCity
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onCityAdded={handleCityAdded}
                    cityData={data.find(city => city._id === editingCityId)}
                    refetch={fetchCities}
                />
            )}
        </div>
    );
};

export default DataCities;
