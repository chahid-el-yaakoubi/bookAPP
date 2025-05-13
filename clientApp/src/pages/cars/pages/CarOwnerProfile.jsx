import React from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../../../components/Navbar';
import Footer from '../../../components/footer';
import { FaStar, FaUser, FaCar } from 'react-icons/fa';
import CarCard from '../components/CarCard';

const CarOwnerProfile = () => {
    const { id } = useParams();
    
    // Simuler les données du propriétaire (à remplacer par un appel API)
    const owner = {
        id: parseInt(id),
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        rating: 4.9,
        totalCars: 3,
        location: "Paris",
        description: "Professional car rental service provider with over 5 years of experience. We ensure the best quality vehicles and excellent customer service.",
        cars: [
            {
                id: 1,
                name: "Mercedes C-Class",
                image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                price: 150,
                location: "Paris",
                rating: 4.8
            },
            {
                id: 2,
                name: "BMW 3 Series",
                image: "https://images.unsplash.com/photo-1555215695-300b0ca6ba4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                price: 180,
                location: "Paris",
                rating: 4.9
            },
            {
                id: 3,
                name: "Audi A4",
                image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
                price: 160,
                location: "Paris",
                rating: 4.7
            }
        ]
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 mt-16">
                {/* Profil du propriétaire */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-start space-x-6">
                        <img 
                            src={owner.avatar} 
                            alt={owner.name}
                            className="w-24 h-24 rounded-full"
                        />
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{owner.name}</h1>
                            <div className="flex items-center text-gray-600 mb-4">
                                <FaStar className="text-yellow-400 mr-1" />
                                <span>{owner.rating}</span>
                                <span className="mx-2">•</span>
                                <FaCar className="mr-1" />
                                <span>{owner.totalCars} cars</span>
                            </div>
                            <p className="text-gray-600">{owner.description}</p>
                        </div>
                    </div>
                </div>

                {/* Liste des voitures */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Available Cars</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {owner.cars.map(car => (
                            <CarCard 
                                key={car.id} 
                                car={{
                                    ...car,
                                    owner: {
                                        id: owner.id,
                                        name: owner.name,
                                        avatar: owner.avatar
                                    }
                                }} 
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CarOwnerProfile; 