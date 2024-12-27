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
        <div className="flex-[6] p-6">
            <div className="flex items-center justify-between px-4 py-2 bg-orange-400 rounded text-xl">
                <h1>NOUVELLE UTILISATEUR</h1>
                <Link to="/users/">
                    <button className='border-2 border-blue-900 rounded px-2 p-1 bg-black text-white text-sm hover:bg-blue-500 hover:text-white transition-colors duration-200'>
                        tout utilisateur
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="border border-black rounded p-6 mt-5">
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                
                <div className="flex lg:flex-row md:flex-col">
                    <div className="profile flex-[1] flex items-center justify-center">
                        <div className="bg-gray-500 h-[200px] w-[200px] rounded">
                            {formData.img && (
                                <img 
                                    src={URL.createObjectURL(formData.img)} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover rounded"
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex-[1] p-5 flex flex-col gap-10">
                        <div className="flex flex-row justify-between items-center">
                            <label htmlFor="img">Images:</label>
                            <input 
                                type="file" 
                                name="img" 
                                onChange={handleChange}
                                className="bg-transparent"
                            />
                        </div>

                        <div className="flex flex-col mt-9">
                            <label htmlFor="fullName">Nom et Prénom:</label>
                            <input 
                                type="text" 
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="bg-transparent border-b-2 border-blue-900 p-2 outline-none hover:border-red-500"
                                placeholder="John Doe" 
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="phone">Télephone:</label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="bg-transparent border-b-2 border-blue-900 p-2 outline-none hover:border-red-500"
                                placeholder="06 25 55 78 45" 
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="city">Ville:</label>
                            <input 
                                type="text" 
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="bg-transparent border-b-2 border-blue-900 p-2 outline-none hover:border-red-500"
                                placeholder="Nador" 
                            />
                        </div>
                    </div>

                    <div className="flex-[1] p-5 flex flex-col gap-10">
                        <div className="flex flex-col">
                            <label htmlFor="username">UserName:</label>
                            <input 
                                type="text" 
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="bg-transparent border-b-2 border-blue-900 p-2 outline-none hover:border-red-500"
                                placeholder="John_Doe"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email">Email:</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-transparent border-b-2 border-blue-900 p-2 outline-none hover:border-red-500"
                                placeholder="Johndoe@gmail.com"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="password">Mode passe:</label>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-transparent border-b-2 border-blue-900 p-2 outline-none hover:border-red-500"
                                placeholder="**************"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="confirmPassword">Confirm Mode passe:</label>
                            <input 
                                type="password" 
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="bg-transparent border-b-2 border-blue-900 p-2 outline-none hover:border-red-500"
                                placeholder="**************"
                                required
                            />
                        </div>

                        <div className="flex justify-around">
                            <label htmlFor="isAdmin">Admin :</label>
                            <div className="flex items-center">
                                <input 
                                    type="radio" 
                                    id="oui" 
                                    name="isAdmin" 
                                    value="true"
                                    checked={formData.isAdmin === true}
                                    onChange={(e) => setFormData(prev => ({...prev, isAdmin: true}))}
                                    className="" 
                                />
                                <label htmlFor="oui" className="ps-4 cursor-pointer text-lg">Oui</label>
                            </div>
                            <div className="flex items-center">
                                <input 
                                    type="radio" 
                                    id="non" 
                                    name="isAdmin" 
                                    value="false"
                                    checked={formData.isAdmin === false}
                                    onChange={(e) => setFormData(prev => ({...prev, isAdmin: false}))}
                                    className="" 
                                />
                                <label htmlFor="non" className="ps-4 cursor-pointer text-lg">Non</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-20">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-md p-2 rounded w-64">Ajouter</button>

                </div>

            </form>

        </div>
    )
}