import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

export const VerifyUser = () => {
    const navigate = useNavigate()
    const [status, setStatus] = useState('pending') // 'pending', 'verifying', 'success', 'error'
    const [message, setMessage] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const {userId} = useParams()


    const handleVerification = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            setMessage('Please enter a valid 6-digit code')
            setStatus('error')
            return
        }

        setStatus('verifying')
        try {
            const response = await axios.post(`/api/auth/verify/${userId}` , {
                iduser: userId,
                code: verificationCode
            })
            setStatus('success')
            setMessage(response.data.message || 'Email verified successfully!')
            setTimeout(() => {
                navigate('/users')
            }, 3000)
        } catch (error) {
            setStatus('error')
            setMessage(error.response?.data?.message || 'Verification failed')
        }
    }

    return (
        <div className="flex-[6] p-8 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
                <h1 className="text-2xl font-semibold text-center mb-4">
                    Email Verification
                </h1>
                
                {status === 'pending' && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            maxLength="6"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        />
                        <button
                            onClick={handleVerification}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Verify Code
                        </button>
                    </div>
                )}

                {(status !== 'pending') && (
                    <div className={`text-center p-4 rounded-md ${
                        status === 'verifying' ? 'bg-blue-50 text-blue-700' :
                        status === 'success' ? 'bg-green-50 text-green-700' :
                        'bg-red-50 text-red-700'
                    }`}>
                        {status === 'verifying' && (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
                                <span>Verifying your code...</span>
                            </div>
                        )}
                        {(status === 'success' || status === 'error') && (
                            <p>{message}</p>
                        )}
                    </div>
                )}

                {status === 'success' && (
                    <p className="text-center mt-4 text-gray-600">
                        Redirecting to login page...
                    </p>
                )}
            </div>
        </div>
    )
}
