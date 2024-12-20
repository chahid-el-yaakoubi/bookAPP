import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSwimmingPool,
  faSmokingBan,
  faParking,
  faWifi,
  faCoffee,
  faUtensils,
  faBed,
  faBath,
  faTshirt,
  faEye,
  faUmbrellaBeach,
  faLanguage,
  faKey,
  faHouse,
  faShirt,
  faClock,
  faDumbbell,
  faElevator,
  faFire,
  faPrint,
  faBuilding,
  faCar,
  faBellConcierge,
  faPersonSwimming,
  faWineGlass,
  faWheelchair,
  faPaw,
  faSuitcase,
  faPhone,
  faTv,
  faCheck,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// Icon mapping object
const iconMapping = {
  smokingBan: faSmokingBan,
  dumbbell: faDumbbell,
  bellConcierge: faBellConcierge,
  wheelchair: faWheelchair,
  utensils: faUtensils,
  car: faCar,
  umbrellaBeach: faUmbrellaBeach,
  coffee: faCoffee,
  wineGlass: faWineGlass,
  user: faUser,
  bath: faBath,
  tshirt: faTshirt,
  wifi: faWifi,
  eye: faEye,
  language: faLanguage,
  key: faKey,
  house: faHouse,
  shirt: faShirt,
  clock: faClock,
  elevator: faElevator,
  fire: faFire,
  print: faPrint,
  building: faBuilding,
  personSwimming: faPersonSwimming,
  paw: faPaw,
  suitcase: faSuitcase,
  phone: faPhone,
  tv: faTv,
  check: faCheck,
};

// Hotel facilities data
const hotelFacilitiesData = {
  highlights: [
    { id: 1, icon: 'smokingBan', text: "Chambres non-fumeurs" },
    { id: 2, icon: 'dumbbell', text: "Centre de remise en forme" },
    { id: 3, icon: 'bellConcierge', text: "Service d'étage" },
    { id: 4, icon: 'wheelchair', text: "Équipements pour les personnes handicapées" },
    { id: 5, icon: 'utensils', text: "Restaurant" },
    { id: 6, icon: 'car', text: "Parking gratuit" },
    { id: 7, icon: 'umbrellaBeach', text: "En bord de plage" },
    { id: 8, icon: 'coffee', text: "Plateau/bouilloire dans tous les hébergements" },
    { id: 9, icon: 'wineGlass', text: "Bar" },
    { id: 10, icon: 'coffee', text: "Très bon petit-déjeuner" }
  ],
  categories: [
    {
      id: 1,
      icon: 'user',
      title: 'Idéal pour votre séjour',
      items: [
        { id: 1, text: "En bord de plage" },
        { id: 2, text: "Plage" },
        { id: 3, text: "Connexion Wi-Fi gratuite" },
        { id: 4, text: "Parking gratuit" },
        { id: 5, text: "Climatisation" },
        { id: 6, text: "Restaurant" },
        { id: 7, text: "Parking" },
        { id: 8, text: "Service de navette" },
        { id: 9, text: "Chambres familiales" },
        { id: 10, text: "Chambres non-fumeurs" }
      ]
    },
    {
      id: 2,
      icon: 'bath',
      title: 'Salle de bains',
      items: [
        { id: 1, text: "Articles de toilette gratuits" },
        { id: 2, text: "Sèche-cheveux" }
      ]
    },
    {
      id: 3,
      icon: 'umbrellaBeach',
      title: 'En extérieur',
      items: [
        { id: 1, text: "En bord de plage" }
      ]
    },
    {
      id: 4,
      icon: 'utensils',
      title: 'Cuisine',
      items: [
        { id: 1, text: "Réfrigérateur" }
      ]
    },
    {
      id: 5,
      icon: 'paw',
      title: 'Animaux domestiques',
      items: [
        { id: 1, text: "Les animaux de compagnie sont admis (un supplément peut s'appliquer)" }
      ]
    },
    {
      id: 6,
      icon: 'personSwimming',
      title: 'Activités',
      items: [
        { id: 1, text: "Plage" }
      ]
    },
    {
      id: 7,
      icon: 'tv',
      title: 'High-tech',
      items: [
        { id: 1, text: "Télévision à écran plat" },
        { id: 2, text: "Téléphone" },
        { id: 3, text: "Télévision" }
      ]
    },
    {
      id: 8,
      icon: 'utensils',
      title: 'Restauration',
      items: [
        { id: 1, text: "Vin/champagne", supplement: true },
        { id: 2, text: "Menus enfants", supplement: true },
        { id: 3, text: "Snack-bar" },
        { id: 4, text: "Bar" },
        { id: 5, text: "Restaurant" },
        { id: 6, text: "Plateau / bouilloire" }
      ]
    },
    {
      id: 9,
      icon: 'wifi',
      title: 'Internet',
      items: [
        { id: 1, text: "Une connexion Wi-Fi est disponible dans tout l'établissement gratuitement" }
      ]
    },
    {
      id: 10,
      icon: 'car',
      title: 'Parking',
      items: [
        { id: 1, text: "Un parking gratuit et privé est disponible sur place (sans possibilité de réserver)" }
      ]
    },
    {
      id: 11,
      icon: 'bellConcierge',
      title: 'Réception',
      items: [
        { id: 1, text: "Bagagerie" },
        { id: 2, text: "Réception ouverte 24h/24" }
      ]
    },
    {
      id: 12,
      icon: 'shirt',
      title: 'Services de nettoyage',
      items: [
        { id: 1, text: "Service de repassage", supplement: true },
        { id: 2, text: "Nettoyage à sec", supplement: true },
        { id: 3, text: "Blanchisserie/laverie", supplement: true }
      ]
    },
    {
      id: 13,
      icon: 'building',
      title: "Services d'affaires",
      items: [
        { id: 1, text: "Fax/photocopies", supplement: true },
        { id: 2, text: "Centre d'affaires" },
        { id: 3, text: "Salles de réunion/réception" }
      ]
    },
    {
      id: 14,
      icon: 'key',
      title: 'Sécurité',
      items: [
        { id: 1, text: "Extincteurs" },
        { id: 2, text: "Caméras de surveillance à l'extérieur de l'établissement" },
        { id: 3, text: "Caméras de surveillance dans les parties communes" },
        { id: 4, text: "Détecteurs de fumée" },
        { id: 5, text: "Alarme de sécurité" },
        { id: 6, text: "Cartes d'accès" },
        { id: 7, text: "Clés d'accès" },
        { id: 8, text: "Sécurité 24h/24" },
        { id: 9, text: "Coffre-fort" }
      ]
    },
    {
      id: 15,
      icon: 'house',
      title: 'Général',
      items: [
        { id: 1, text: "Service de navette", supplement: true },
        { id: 2, text: "Supérette sur place" },
        { id: 3, text: "Espace fumeurs" },
        { id: 4, text: "Climatisation" },
        { id: 5, text: "Chauffage" },
        { id: 6, text: "Ascenseur" },
        { id: 7, text: "Chambres familiales" },
        { id: 8, text: "Matériel de repassage" },
        { id: 9, text: "Équipements pour les personnes handicapées" },
        { id: 10, text: "Chambres non-fumeurs" },
        { id: 11, text: "Service d'étage" }
      ]
    },
    {
      id: 16,
      icon: 'wheelchair',
      title: 'Accessibilité',
      items: [
        { id: 1, text: "Toilettes avec barres d'appui" },
        { id: 2, text: "Accessible en fauteuil roulant" }
      ]
    },
    {
      id: 17,
      icon: 'dumbbell',
      title: 'Bien-être',
      items: [
        { id: 1, text: "Fitness" },
        { id: 2, text: "Centre de remise en forme" }
      ]
    },
    {
      id: 18,
      icon: 'language',
      title: 'Langues parlées',
      items: [
        { id: 1, text: "Arabe" },
        { id: 2, text: "Anglais" },
        { id: 3, text: "Espagnol" },
        { id: 4, text: "Français" }
      ]
    }
  ]
};

// Window width hook
const useWindowWidth = () => {
  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

// Main component
export const HotelFacilities = () => {
  const [showAll, setShowAll] = React.useState(false);
  const windowWidth = useWindowWidth();
  
  const getDisplayItems = (items, limit = 3) => {
    if (showAll || windowWidth >= 768) {
      return items;
    }
    return items.slice(0, limit);
  };

  // Add this function to get different hover colors based on category ID
  const getCategoryColorClass = (categoryId) => {
    const colorClasses = {
      1: 'hover:bg-blue/60',  // Ideal for your stay
      2: 'hover:bg-pink-100',  // Bathroom
      3: 'hover:bg-yellow-100', // Outdoors
      4: 'hover:bg-orange-100', // Kitchen
      5: 'hover:bg-purple-100', // Pets
      6: 'hover:bg-cyan-100',   // Activities
      7: 'hover:bg-emerald-100', // High-tech
      8: 'hover:bg-red-100',    // Dining
      9: 'hover:bg-sky-100',    // Internet
      10: 'hover:bg-lime-100',  // Parking
      11: 'hover:bg-amber-100', // Reception
      12: 'hover:bg-rose-100',  // Cleaning services
      13: 'hover:bg-indigo-100', // Business services
      14: 'hover:bg-violet-100', // Security
      15: 'hover:bg-green-100', // General
      16: 'hover:bg-teal-100',  // Accessibility
      17: 'hover:bg-fuchsia-100', // Wellness
      18: 'hover:bg-blue/40',  // Languages
    };
    return colorClasses[categoryId] || 'hover:bg-gray-50';
  };

  return (
    <div className="mt-8 space-y-8 bg-gray-50 p-4 rounded-lg">
      {/* Highlights Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Ses points forts</h2>
        <div className="flex flex-wrap gap-3">
          {hotelFacilitiesData.highlights.map((item) => (
            <div key={item.id} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm">
              <FontAwesomeIcon icon={iconMapping[item.icon]} className="text-gray-600" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {hotelFacilitiesData.categories.map((category) => (
          <div 
            key={category.id} 
            className={`p-4 rounded-lg bg-gray-100 shadow-md transition-all duration-200 ${getCategoryColorClass(category.id)} hover:shadow-lg`}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={iconMapping[category.icon]} />
              {category.title}
            </h3>
            <div className="space-y-2">
              {getDisplayItems(category.items).map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheck} className="text-gray-600" />
                  <span>
                    {item.text}
                    {item.supplement && (
                      <span className="text-sm text-gray-500 ml-1">En supplément</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
            {windowWidth < 768 && category.items.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-blue-600 hover:underline mt-2 flex items-center gap-1"
              >
                {showAll ? 'Voir moins' : 'Voir plus'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Feedback Section */}
      <div className="mt-6 text-right text-sm">
        <span className="text-gray-500">Il vous manque des informations ? </span>
        <button className="text-blue-600 hover:underline">Oui</button>
        <span className="mx-1">/</span>
        <button className="text-blue-600 hover:underline">Non</button>
      </div>
    </div>
  );
}; 