import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export const ContactModal = ({ isOpen, onClose, hotel }) => {
    const [formData, setFormData] = useState({
        message: "Bonjour, je suis intéressé(e) par ce bien et j'aimerais organiser une visite.\nCordialement",
        email: '',
        phone: '',
        name: '',
        acceptPolicy: false
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex md:items-center justify-center">
            <div className="fixed md:relative bottom-0 left-0 right-0 bg-white rounded-t-2xl md:rounded-xl shadow-xl w-full md:w-[500px] md:m-4">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Contacter l'annonceur</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="mb-4">
                        <p className="font-medium">{hotel?.title}</p>
                        <p className="text-gray-600 text-sm">Bien à louer à {hotel?.baseInfo?.address}, Nador</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <textarea
                            className="w-full border rounded-lg p-3 mb-4 min-h-[100px]"
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />

                        <button type="button" className="w-full py-3 mb-4 text-center text-blue border border-blue rounded-lg">
                            Créer un profil locataire
                        </button>

                        <input
                            type="email"
                            placeholder="Votre email"
                            className="w-full border rounded-lg p-3 mb-4"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />

                        <div className="flex flex-col  gap-4 mb-4">
                            <div className="w-full sm:flex-1">
                                <div className="flex border rounded-lg">
                                    <select className="p-3 border-r w-24">
                                        <option>+212</option>
                                        <option>+34</option>
                                        <option>+33</option>
                                    </select>
                                    <input
                                        type="tel"
                                        placeholder="6 12 34 56 78"
                                        className="p-3 flex-1 w-full"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <input
                                type="text"
                                placeholder="Votre nom"
                                className="w-full sm:flex-1 border rounded-lg p-3"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.acceptPolicy}
                                    onChange={(e) => setFormData({...formData, acceptPolicy: e.target.checked})}
                                    required
                                />
                                <span className="text-sm">
                                    J'accepte la <a href="#" className="text-blue-600">politique de confidentialité</a>
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue text-white py-3 rounded-lg hover:bg-blue/90"
                        >
                            Contact via chat
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}; 