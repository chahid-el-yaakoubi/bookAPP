import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faRightFromBracket,
  faBan,
  faCircleInfo,
  faBed,
  faUser,
  faDog,
  faHandshake,
  faMosque,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";

export const HouseRules = ({ propertyName = "Villa Le Belvedere", hotelDataRules }) => {
  // Add default values and error handling
  const defaultTimeRange = { from: "--:--", to: "--:--" };
  const defaultRules = {
    TIMING: {
      CHECK_IN: { timeRange: defaultTimeRange },
      CHECK_OUT: { timeRange: defaultTimeRange }
    },
    POLICIES: {
      DAMAGE: { maxAmount: 0 }
    },
    GUESTS: {
      CHILDREN: { isAllowed: false }
    },
    RESTRICTIONS: {
      PETS: { isAllowed: false },
      PARTIES: { isAllowed: false }
    }
  };

  // Safely access data with fallbacks
  const rules = hotelDataRules || defaultRules;
  const checkIn = rules.TIMING?.CHECK_IN?.timeRange || defaultTimeRange;
  const checkOut = rules.TIMING?.CHECK_OUT?.timeRange || defaultTimeRange;
  const damageAmount = rules.POLICIES?.DAMAGE?.maxAmount || 0;

  return (
    <div className=" bg-gray-100 mx-auto p-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Règlement intérieur</h2>
        <button className="bg-blue text-white px-4 py-2 rounded-md">
          Voir les disponibilités
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        {propertyName} accepte les demandes spéciales - à ajouter à l'étape suivante !
      </p>

      <div className="space-y-6 border border-gray-300 rounded-lg p-4">
        {/* Check-in */}
        <div className="flex items-start gap-4">
          <FontAwesomeIcon icon={faRightToBracket} className="mt-1" />
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="font-semibold">Arrivée</span>
              <span>
                De {checkIn.from} à {checkIn.to}
              </span>
            </div>
          </div>
        </div>

        {/* Check-out */}
        <div className="flex items-start gap-4 border-t pt-4">
          <FontAwesomeIcon icon={faRightFromBracket} className="mt-1" />
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="font-semibold">Départ</span>
              <span>
                De {checkOut.from} à {checkOut.to}
              </span>
            </div>
          </div>
        </div>

        {/* Cancellation/prepayment */}
        <div className="flex items-start gap-4 border-gray-300 border-t pt-4">
          <FontAwesomeIcon icon={faCircleInfo} className="mt-1" />
          <div className="flex-1">
            <div className="font-semibold">Conditions d'annulation/prépaiement</div>
            <p className="text-sm">
              Les conditions d'annulation et de prépaiement varient selon le type d'hébergement.
              Vérifiez les <a href="#" className="text-blue">conditions</a> applicables à chaque option lors de votre sélection.
            </p>
          </div>
        </div>

        {/* Damage policy */}
        <div className="flex items-start gap-4 border-gray-300 border-t pt-4">
          <FontAwesomeIcon icon={faCircleInfo} className="mt-1" />
          <div className="flex-1">
            <div className="font-semibold">Politique d'assurance</div>
            <p className="text-sm">
              Si vous causez des dommages à la propriété pendant votre séjour, vous pourriez être invité à payer
              jusqu'à € {damageAmount} après le départ, selon la politique d'assurance de cette propriété.
            </p>
          </div>
        </div>

        {/* Children & Beds */}
        <div className="flex items-start gap-4 border-gray-300 border-t pt-4">
          <FontAwesomeIcon icon={faBed} className="mt-1" />
          <div className="flex-1">
            <div className="font-semibold">Enfants et lits d'appoint</div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Politique concernant les enfants</h4>
                <p className="text-sm">
                  {rules.GUESTS?.CHILDREN?.isAllowed 
                    ? "Les enfants de tous âges sont les bienvenus."
                    : "Les enfants ne sont pas acceptés dans cet établissement."}
                </p>
                <p className="text-sm text-gray-600">
                  Pour voir les prix et les disponibilités corrects, ajoutez le nombre et l'âge des enfants
                  de votre groupe à votre recherche.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Politique des lits d'appoint et des berceaux</h4>
                <div className="border rounded mt-2">
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <div>0 - 6 ans</div>
                      <div className="text-sm flex items-center gap-2">
                        <FontAwesomeIcon icon={faBed} className="text-gray-600" />
                        Berceau sur demande
                      </div>
                    </div>
                    <div>10 € par enfant et par nuit</div>
                  </div>
                </div>
                <p className="text-sm mt-2">
                  Les prix des berceaux ne sont pas inclus dans le prix total. Ils devront être payés
                  séparément pendant votre séjour.
                </p>
                <p className="text-sm mt-2">
                  Le nombre de berceaux autorisés dépend de l'option choisie. Vérifiez
                  l'option sélectionnée pour plus d'informations.
                </p>
                <p className="text-sm mt-2">Aucun lit d'appoint n'est disponible dans cet établissement.</p>
                <p className="text-sm mt-2">Tous les berceaux sont sous réserve de disponibilité.</p>
              </div>
            </div>
          </div>
        </div>

        {/* No age restriction */}
        <div className="flex items-start gap-4 border-gray-300 border-t pt-4">
          <FontAwesomeIcon icon={faUser} className="mt-1" />
          <div className="flex-1">
            <div className="font-semibold">Pas de restriction d'âge</div>
            <p className="text-sm">Il n'y a pas d'âge minimum pour l'enregistrement</p>
          </div>
        </div>

        {/* Pets */}
        <div className="flex items-start gap-4 border-gray-300 border-t pt-4">
          <FontAwesomeIcon icon={faDog} className="mt-1" />
          <div className="flex-1">
            <div className="font-semibold">Animaux domestiques</div>
            <p className="text-sm">
              {rules.RESTRICTIONS?.PETS?.isAllowed 
                ? "Les animaux sont acceptés."
                : "Les animaux ne sont pas acceptés."}
            </p>
          </div>
        </div>

        {/* Parties */}
        <div className="flex items-start gap-4 border-gray-300 border-t pt-4">
          <FontAwesomeIcon icon={faBan} className="mt-1" />
          <div className="flex-1">
            <div className="font-semibold">Fêtes</div>
            <p className="text-sm">
              {rules.RESTRICTIONS?.PARTIES?.isAllowed 
                ? "Les fêtes/événements sont autorisés"
                : "Les fêtes/événements ne sont pas autorisés"}
            </p>
          </div>
        </div>

        {/* Traditional Welcome */}
        <div className="flex items-start gap-4 border-gray-300 border-t pt-4">
          <FontAwesomeIcon icon={faHandshake} className="mt-1" />
          <div className="flex-1">
            <div className="font-semibold">Accueil Traditionnel</div>
            <p className="text-sm">
              Profitez de notre accueil traditionnel marocain avec thé à la menthe et pâtisseries locales à votre arrivée.
            </p>
          </div>
        </div>

        {/* Religious Services */}
        <div className="flex items-start gap-4 border-gray-300 border-t pt-4">
          <FontAwesomeIcon icon={faMosque} className="mt-1" />
          <div className="flex-1">
            <div className="font-semibold">Services Religieux</div>
            <p className="text-sm">
              Tapis de prière disponibles sur demande. Direction de la Qibla indiquée dans chaque chambre.
            </p>
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="flex items-start gap-4 border-gray-300 border-t pt-4">
          <FontAwesomeIcon icon={faUtensils} className="mt-1" />
          <div className="flex-1">
            <div className="font-semibold">Régimes Alimentaires</div>
            <p className="text-sm">
              Options halal disponibles. Merci de nous informer de vos préférences alimentaires à l'avance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 