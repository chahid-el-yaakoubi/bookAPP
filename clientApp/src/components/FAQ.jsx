import React, { useState } from 'react';
import { PageReload } from './pageRealod/pageRealod';
import { Logo } from './Navbar';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200">
      <button
        className="w-full px-6 py-5 flex justify-between items-center text-left transition-colors duration-200"
        onClick={onClick}
      >
        <span className="font-medium text-gray-900 text-lg">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''
            }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-6 pb-5 text-gray-600">
          {answer}
        </div>
      </div>
    </div>
  );
};

export const FAQ = ({ hotelData }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: `Combien de chambres possède ${hotelData.name} ?`,
      answer: `${hotelData.name} dispose de 3 chambres spacieuses.`
    },
    {
      question: `À quelle distance se trouve ${hotelData.name} du centre de Tanger ?`,
      answer: "La propriété est située à 2,5 km du centre-ville."
    },
    {
      question: `${hotelData.name} dispose-t-il d'un restaurant sur place ?`,
      answer: "Oui, il y a un restaurant familial servant des plats africains, américains, argentins et des pizzas."
    },
    {
      question: `${hotelData.name} est-il populaire auprès des familles ?`,
      answer: "Oui, cette propriété est très appréciée des familles grâce à son agencement spacieux et ses équipements adaptés aux familles."
    },
    {
      question: `Quels équipements sont disponibles à ${hotelData.name} ?`,
      answer: `La propriété propose diverses activités récréatives, notamment le vélo, la randonnée et des visites guidées à pied. Les clients peuvent également profiter de notre piscine, du jardin paysager et de la terrasse privée.`
    },
    {
      question: `Quels sont les tarifs à ${hotelData.name} ?`,
      answer: `Nos tarifs sont saisonniers et varient selon la durée du séjour. Veuillez contacter notre équipe de réservation ou consulter notre plateforme de réservation pour connaître les prix actuels.`
    },
    {
      question: `Quelles sont les heures d'arrivée et de départ à ${hotelData.name} ?`,
      answer: "L'enregistrement est disponible à partir de 14h00 et le départ jusqu'à 12h00."
    },
    {
      question: `Combien de personnes peuvent dormir à ${hotelData.name} ?`,
      answer: "L'appartement peut accueillir confortablement jusqu'à 6 personnes."
    },
    {
      question: `À quelle distance de la plage se trouve ${hotelData.name} ?`,
      answer: "La propriété est en bord de mer, offrant un accès direct à la plage."
    },
    {
      question: `${hotelData.name} dispose-t-il d'une piscine ?`,
      answer: "Oui, la propriété dispose d'une piscine pour les clients."
    }
  ];

  return (
    <div className="mt-8  mx-auto ">
      <h2 className="text-3xl font-semibold mb-8 text-gray-900">FAQ à propos de {hotelData.name}</h2>
      <div className="rounded-lg border border-gray-200 divide-y divide-gray-200 flex">
        <div className=" p-4 w-[40%] relative flex items-start justify-center" style={{ background : `url(${hotelData?.photos[5].url}) no-repeat center center / cover`}}>
          <Logo />
        </div>
        <div>
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index} 
              question={faq.question} 
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 