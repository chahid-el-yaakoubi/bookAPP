import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import useFetch from "../../../hooks/useFetch"

const UpdateUser = () => {
    const { userId } = useParams()
    const { data: user, loading } = useFetch(`/api/users/${userId}`)
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
        isVerified: false
    })

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
                password: '',
                confirmPassword: '',
                isVerified: user.isVerified
            }))
        }
    }, [user])

    const  handleChange = (e) => {
        const { name, value, type, files, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] 
                  : type === 'radio' && name === 'isAdmin' ? checked
                  : type === 'checkbox' && name === 'isVerified' ? checked
                  : type === 'checkbox' && name === 'adminCars' ? checked
                  : type === 'checkbox' && name === 'adminUsers' ? checked
                  : type === 'checkbox' && name === 'adminHotes' ? checked
                  : type === 'checkbox' && name === 'adminHouses' ? checked
                  : type === 'checkbox' && name === 'adminShops' ? checked
                  : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        
        // Only validate passwords if either password field is filled
        if (formData.password || formData.confirmPassword) {
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords don't match!")
                return
            }
        }

        const submitData = new FormData()
        Object.keys(formData).forEach(key => {
            if (key !== 'confirmPassword') {
                // Only include password if it was changed
                if (key === 'password' && !formData.password) {
                    return
                }
                // Only append if the value exists
                if (formData[key] !== null && formData[key] !== undefined) {
                    submitData.append(key, formData[key])
                }
            }
        })

        try {
            const response = await axios.put(`/api/users/${userId}`, submitData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            
            console.log('Response:', response.data)
            navigate('/users')
        } catch (error) {
            console.error('Update error:', error)
            setError(
                error.response?.data?.message || 
                error.message || 
                'Something went wrong!'
            )
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex-[6] p-8 bg-gray-50">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">MODIFIER UTILISATEUR</h1>
                <Link to="/users/">
                    <button className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200'>
                        tout utilisateur
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
                {error && <div className="text-red-500 text-center mb-6 p-3 bg-red-50 rounded">{error}</div>}
                
                <div className="flex lg:flex-row md:flex-col gap-8">
                    <div className="profile flex-[1] flex flex-col items-center space-y-4">
                        <div className="bg-gray-100 h-[200px] w-[200px] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            {formData.img ? (
                                <img 
                                    src={URL.createObjectURL(formData.img)} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <span className="text-gray-400">No image</span>
                            )}
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Images:</label>
                            <input 
                                type="file" 
                                name="img" 
                                onChange={handleChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    <div className="flex-[1] flex flex-col gap-6">
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nom et Prénom:</label>
                            <input 
                                type="text" 
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="John Doe" 
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Télephone:</label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nador" 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="isVerified" className="block text-sm font-medium text-gray-700 mb-2">Vérifié:</label>
                            <input type="checkbox" id="isVerified" name="isVerified" checked={formData.isVerified} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>

                    <div className="flex-[1] flex flex-col gap-6">
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">UserName:</label>
                            <input 
                                type="text" 
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Johndoe@gmail.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mode passe: (Optional)</label>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Leave blank to keep current password"
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Mode passe: (Optional)</label>
                            <input 
                                type="password" 
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Leave blank to keep current password"
                            />
                        </div>

                        <div className="form-group mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-4">Admin :</label>
                            <div className="flex gap-6">
                                <div className="flex items-center">
                                    <input 
                                        type="radio" 
                                        id="oui" 
                                        name="isAdmin" 
                                        value="true"
                                        checked={formData.isAdmin === true}
                                        onChange={(e) => setFormData(prev => ({...prev, isAdmin: true}))}
                                        className="w-4 h-4 text-blue-600" 
                                    />
                                    <label htmlFor="oui" className="ml-2 text-gray-700">Oui</label>
                                </div>
                                <div className="flex items-center">
                                    <input 
                                        type="radio" 
                                        id="non" 
                                        name="isAdmin" 
                                        value="false"
                                        checked={formData.isAdmin === false}
                                        onChange={(e) => setFormData(prev => ({...prev, isAdmin: false}))}
                                        className="w-4 h-4 text-blue-600" 
                                    />
                                    <label htmlFor="non" className="ml-2 text-gray-700">Non</label>
                                </div>
                            </div>
                        </div>

                        {formData.isAdmin && (
                            <div className="form-group mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-4">Catégories d'administration :</label>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="adminCars" 
                                            name="adminCars"
                                            checked={formData.adminCars}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600" 
                                        />
                                        <label htmlFor="adminCars" className="ml-2 text-gray-700">Voitures</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="adminUsers" 
                                            name="adminUsers"
                                            checked={formData.adminUsers}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600" 
                                        />
                                        <label htmlFor="adminUsers" className="ml-2 text-gray-700">Utilisateurs</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="adminHotes" 
                                            name="adminHotes"
                                            checked={formData.adminHotes}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600" 
                                        />
                                        <label htmlFor="adminHotes" className="ml-2 text-gray-700">Hôtes</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="adminHouses" 
                                            name="adminHouses"
                                            checked={formData.adminHouses}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600" 
                                        />
                                        <label htmlFor="adminHouses" className="ml-2 text-gray-700">Maisons</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="adminShops" 
                                            name="adminShops"
                                            checked={formData.adminShops}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600" 
                                        />
                                        <label htmlFor="adminShops" className="ml-2 text-gray-700">Magasins</label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center mt-8">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium">
                        Modifier
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UpdateUser