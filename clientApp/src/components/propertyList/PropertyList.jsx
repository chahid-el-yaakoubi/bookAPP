import React from 'react';
import './PropertyList.css';
import useFetch from '../../hooks/useFetch';
import { useTranslation } from 'react-i18next';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const PropertyList = () => {
    const { t } = useTranslation();
    
    const propertyTypes = [
        {
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
            title: t('properties.hotels.title'),
            type: 'hotel',
            description: t('properties.hotels.description')
        },
        {
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070',
            title: t('properties.apartments.title'),
            type: 'apartment',
            description: t('properties.apartments.description')
        },
        {
            image: 'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=2070',
            title: t('properties.BeachResorts.title'),
            type: 'beach_resort',
            description: t('properties.BeachResorts.description')
        },
        {
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071',
            title: t('properties.Riads.title'),
            type: 'riad',
            description: t('properties.Riads.description')
        },
        {
            image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070',
            title: t('properties.VacationHomes.title'),
            type: 'vacation_home',
            description: t('properties.VacationHomes.description')
        },
    ];

    const { data, error, loading } = useFetch("/api/hotels/countByType");

    if (error) return (
        <div className="text-red-500 p-4 rounded-lg bg-red-100 shadow-md">
            {t('errors.loadingData')}
        </div>
    );

    return (
        <div className="w-full">
            <div className=" mx-auto relative ">
                <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6
                             overflow-x-auto sm:overflow-visible
                             snap-x sm:snap-none
                             scrollbar-hide
                             w-screen sm:w-auto
                             -ml-[calc(50vw-50%)] sm:ml-0
                             pl-[calc(50vw-50%)] sm:pl-4 pr-4">
                    {loading ? (
                        propertyTypes.map((_, i) => (
                            <div 
                                className="bg-gray-200 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105
                                         snap-center flex-shrink-0
                                         w-[80vw] sm:w-auto
                                         first:ml-4 sm:first:ml-0" 
                                key={i}
                            >
                                <div className="h-48 bg-gray-200 animate-pulse"></div>
                                <div className="p-4">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        propertyTypes.map((property, i) => (
                            <div 
                                className="bg-white relative rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl
                                         snap-center flex-shrink-0
                                         w-[80vw] sm:w-auto
                                         first:ml-4 sm:first:ml-0 h-[350px]" 
                                key={i}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        className='w-full h-full object-cover transition-transform duration-300 hover:scale-110' 
                                        src={property.image} 
                                        alt={data[i]?.type || property.title} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-4 bg-white">
                                    <h3 className='text-lg font-semibold capitalize text-gray-800 mb-1'>
                                        {property.title}
                                    </h3>
                                    <h5 className='text-sm text-gray-600 mb-2'>
                                        {data[i]?.count || 0} {t('properties.properties')}
                                    </h5>
                                    <p className='text-lg text-gray-500 line-clamp-2'>
                                        {property.description}
                                    </p>
                                    <button className='absolute flex items-center justify-center gap-2 bottom-0 left-0 w-full bg-yellow-500 text-white font-semibold  p-2 rounded-b-xl'>
                                        {t('properties.viewAll')}

                                        {t("dir") === "rtl" ? <FontAwesomeIcon icon={faArrowLeft} /> : <FontAwesomeIcon icon={faArrowRight} />}

                                    </button>
                                </div>
                                
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
