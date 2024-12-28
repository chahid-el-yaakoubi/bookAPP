import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios" // Make sure axios is installed

export const AddUser = () => {
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        isAdmin: false,
        city: '',
        phone: '',
    })

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
            if (response.data) {
                navigate('/users')
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
        <div className="flex-[6] p-8 bg-gray-50">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">NOUVELLE UTILISATEUR</h1>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mode passe:</label>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="**************"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Mode passe:</label>
                            <input 
                                type="password" 
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="**************"
                                required
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
                    </div>
                </div>

                <div className="flex justify-center mt-8">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium">
                        Ajouter
                    </button>
                </div>
            </form>
        </div>
    )
}