import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios" // Make sure axios is installed
import { useParams } from "react-router-dom"
import useFetch from "../../../hooks/useFetch"
import { useEffect } from "react"

export const AddUser = () => {

    const {userId} = useParams()

    const {data: user, loading} = useFetch(`/api/users/${userId}`)
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        isAdmin: false,
        adminCars: false,
        adminUsers: false,
        adminHotes: false,
        adminHouses: false,
        adminShops: false,
        city: '',
        phone: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                adminCars: user.adminCars,
                adminUsers: user.adminUsers,
                adminHotes: user.adminHotes,
                adminHouses: user.adminHouses,
                adminShops: user.adminShops,
                city: user.city,
                phone: user.phone,
            }))
        }
    }, [user])

    const handleChange = (e) => {
        const { name, value, type, files, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] 
                  : type === 'radio' && name === 'isAdmin' ? checked
                  : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        
        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match!")
            return
        }
        // console.log(formData)
        const submitData = new FormData()
        Object.keys(formData).forEach(key => {
            if (key !== 'confirmPassword') {
                // Only append if the value exists
                if (formData[key] !== null && formData[key] !== undefined) {
                    submitData.append(key, formData[key])
                }
            }
        })

        try {
            const response = await axios.post('/api/auth/register', submitData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            
            console.log('Response:', response.data);
            if (response.data ) {
                navigate(`/users/verify/${response.data.userId}`)
            }
        } catch (error) {
            console.error('Submission error:', error);
            setError(
                error.response?.data?.message || 
                error.message || 
                'Something went wrong!'
            )
        }
    }

    return (
        <div className="flex-[6] p-8 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-md mb-8">
                <h1 className="text-2xl font-semibold text-gray-800">NOUVELLE UTILISATEUR</h1>
                <Link to="/users/">
                    <button className='px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm'>
                        Tout utilisateur
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
                {error && (
                    <div className="text-red-500 text-center mb-6 p-4 bg-red-50 rounded-md border border-red-100">
                        {error}
                    </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="profile flex flex-col items-center space-y-6">
                        <div className="bg-gray-50 h-[220px] w-[220px] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                            {formData.img ? (
                                <img 
                                    src={URL.createObjectURL(formData.img)} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <span className="text-gray-400 text-sm">Aucune image</span>
                            )}
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Image de profil:</label>
                            <input 
                                type="file" 
                                name="img" 
                                onChange={handleChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nom et Prénom:</label>
                            <input 
                                type="text" 
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="John Doe" 
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone:</label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="06 25 55 78 45" 
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ville:</label>
                            <input 
                                type="text" 
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Nador" 
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur:</label>
                            <input 
                                type="text" 
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="John_Doe"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Johndoe@gmail.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe:</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer mot de passe:</label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-8">
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-4">Statut administrateur:</label>
                        <div className="flex gap-8">
                            <div className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    id="oui" 
                                    name="isAdmin" 
                                    value="true"
                                    checked={formData.isAdmin === true}
                                    onChange={(e) => setFormData(prev => ({...prev, isAdmin: true}))}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                />
                                <label htmlFor="oui" className="ml-2 text-gray-700 cursor-pointer">Oui</label>
                            </div>
                            <div className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    id="non" 
                                    name="isAdmin" 
                                    value="false"
                                    checked={formData.isAdmin === false}
                                    onChange={(e) => setFormData(prev => ({...prev, isAdmin: false}))}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                />
                                <label htmlFor="non" className="ml-2 text-gray-700 cursor-pointer">Non</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-4">Catégories d'administration:</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    id="adminCars" 
                                    name="adminCars"
                                    checked={formData.adminCars}
                                    onChange={(e) => setFormData(prev => ({...prev, adminCars: e.target.checked}))}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" 
                                />
                                <label htmlFor="adminCars" className="ml-2 text-gray-700 cursor-pointer">Voitures</label>
                            </div>
                            <div className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    id="adminUsers" 
                                    name="adminUsers"
                                    checked={formData.adminUsers}
                                    onChange={(e) => setFormData(prev => ({...prev, adminUsers: e.target.checked}))}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" 
                                />
                                <label htmlFor="adminUsers" className="ml-2 text-gray-700 cursor-pointer">Utilisateurs</label>
                            </div>
                            <div className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    id="adminHotes" 
                                    name="adminHotes"
                                    checked={formData.adminHotes}
                                    onChange={(e) => setFormData(prev => ({...prev, adminHotes: e.target.checked}))}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" 
                                />
                                <label htmlFor="adminHotes" className="ml-2 text-gray-700 cursor-pointer">Hôtes</label>
                            </div>
                            <div className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    id="adminHouses" 
                                    name="adminHouses"
                                    checked={formData.adminHouses}
                                    onChange={(e) => setFormData(prev => ({...prev, adminHouses: e.target.checked}))}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" 
                                />
                                <label htmlFor="adminHouses" className="ml-2 text-gray-700 cursor-pointer">Maisons</label>
                            </div>
                            <div className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    id="adminShops" 
                                    name="adminShops"
                                    checked={formData.adminShops}
                                    onChange={(e) => setFormData(prev => ({...prev, adminShops: e.target.checked}))}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" 
                                />
                                <label htmlFor="adminShops" className="ml-2 text-gray-700 cursor-pointer">Magasins</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-10">
                    <button className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md">
                        Ajouter
                    </button>
                </div>
            </form>
        </div>
    )
}
