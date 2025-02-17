import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2'; // Importer SweetAlert2

export const Maillist = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');

    const handleSubscribe = () => {
        if (email.trim() === '' || !email.includes('@')) {
            Swal.fire({
                icon: 'error', // Icône d'erreur
                title: t('mailList.errorTitle'),
                text: t('mailList.errorMessage'),
            });
        } else {
            Swal.fire({
                icon: 'success', // Icône de succès
                title: t('mailList.successTitle'),
                text: t('mailList.successMessage'),
            });
            setEmail(''); // Réinitialiser l'input
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 mail flex items-center justify-center py-12 px-4">
            <div className="mailList flex flex-col items-center bg-white rounded-lg shadow-lg p-8 md:p-12 w-full max-w-2xl">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
                    {t('mailList.title')}
                </h1>
                <span className="text-sm md:text-lg text-gray-600 pt-6 pb-4 text-center">
                    {t('mailList.subtitle')}
                </span>

                <div className="mailInputContainer flex items-center w-full mt-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('mailList.placeholder')}
                        className="flex-grow p-3 rounded-l-lg border-t border-b border-l border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    <button
                        onClick={handleSubscribe}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-3 rounded-r-lg transition-all duration-300"
                    >
                        {t('mailList.subscribe')}
                    </button>
                </div>
            </div>
        </div>
    );
};
