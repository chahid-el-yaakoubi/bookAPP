import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

// Action creators
import { selectProperty } from '../../../../../../../redux/actions/propertyActions';

// Icon imports consolidated 
import {
    FaFan, FaThermometerHalf, FaHome, FaLightbulb, FaVolumeMute,
    FaTv, FaVolumeUp, FaGamepad, FaLaptopHouse, FaLaptop,
    FaChair, FaWifi, FaUtensils, FaCoffee, FaFire, FaBath, FaShower,
    FaHotTub, FaTshirt, FaCut, FaSoap, FaParking, FaBus, FaBiking,
    FaCarAlt, FaUmbrellaBeach, FaLock, FaPhone, FaClock,
    FaFilm, FaBook, FaNetworkWired, FaPrint, FaUsb, FaPlug,
    FaPen, FaBlender, FaWater, FaWineGlass, FaTemperatureHigh,
    FaWeight, FaCloudRain, FaChargingStation, FaTaxi, FaSubway,
    FaMotorcycle, FaSwimmingPool, FaDumbbell, FaSpa, FaLeaf, FaArrowUp,
    FaBuilding, FaSuitcase, FaUserClock, FaBriefcase,
    FaUsers, FaWheelchair, FaToilet, FaHandsHelping, FaEye,
    FaExclamationTriangle, FaFireExtinguisher, FaMedkit,
    FaCamera, FaUserShield, FaKey, FaBaby, FaChild, FaTree, FaUmbrella,
    FaSkiing, FaHiking, FaTableTennis, FaGolfBall, FaSun, FaRecycle,
    FaRobot, FaMicrophone, FaProjectDiagram, FaPaw, FaBed, FaDog,
    FaHandHoldingHeart, FaBroom, FaConciergeBell, FaGlassMartini,
    FaShoppingBasket, FaHandsWash, FaMap, FaExchangeAlt,
    FaHatCowboy, FaChevronDown, FaPlus, FaSave, FaChevronUp, FaTimes,
    FaSnowflake, FaDoorOpen
} from 'react-icons/fa';

import { FcDvdLogo } from "react-icons/fc";
import { MdCurtainsClosed, MdOutlineCleaningServices, MdSmokeFree, MdBalcony, MdIron, MdOutlineLocalLaundryService } from 'react-icons/md';
import { GiMirrorMirror, GiToaster, GiTable, GiChessKing, GiKnifeFork, GiSaltShaker, GiSocks, GiIronMask, GiWashingMachine, GiHouse, GiKitchenKnives } from 'react-icons/gi';
import { BiFridge } from 'react-icons/bi';
import { BiStore, BiBuildingHouse } from 'react-icons/bi';
import { RiMedicineBottleLine, RiBankFill } from 'react-icons/ri';
import { IoMdBusiness } from 'react-icons/io';
import { ImSpoonKnife } from 'react-icons/im';
import { BsPrinter } from 'react-icons/bs';
import { TbAirConditioning, TbIroning } from 'react-icons/tb';
import { updateProperty } from '../../../../../../../Lib/api';

/**
 * Universal Amenities Component
 * Reusable component that can handle both room amenities and property features
 * based on the mode prop
 */
const Amenities = ({ mode }) => {
    const { t, i18n } = useTranslation(['properties']);
    const isRTL = i18n.dir() === 'rtl';

    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);
    const { id } = useParams();

    // State management
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [customItem, setCustomItem] = useState('');
    const [customItems, setCustomItems] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Define property type categories
    const hotelTypes = ['hotel', 'guesthouse', 'hostel', 'boutique-hotel'];
    const residentialTypes = ['apartment', 'house', 'villa', 'condo'];

    // Get title and description based on mode
    const getComponentInfo = () => {
        return mode === 'amenities'
            ? {
                title: t('amenities.title'),
                description: t('amenities.description')
            }
            : {
                title: t('amenities.title'),
                description: t('amenities.description')
            };
    };
    // Define all possible amenities
    const roomAmenities = [
        // Room Features
        { id: 'airConditioning', label: t('amenities.items.airConditioning'), icon: FaFan, category: t('amenities.categories.roomFeatures') },
        { id: 'heatingSystem', label: t('amenities.items.heatingSystem'), icon: FaThermometerHalf, category: t('amenities.categories.roomFeatures') },
        { id: 'fan', label: t('amenities.items.fan'), icon: FaFan, category: t('amenities.categories.roomFeatures') },
        { id: 'wardrobe', label: t('amenities.items.wardrobe'), icon: FaHome, category: t('amenities.categories.roomFeatures') },
        { id: 'fullLengthMirror', label: t('amenities.items.fullLengthMirror'), icon: GiMirrorMirror, category: t('amenities.categories.roomFeatures') },
        { id: 'blackoutCurtains', label: t('amenities.items.blackoutCurtains'), icon: MdCurtainsClosed, category: t('amenities.categories.roomFeatures') },
        { id: 'readingLights', label: t('amenities.items.readingLights'), icon: FaLightbulb, category: t('amenities.categories.roomFeatures') },
        { id: 'soundproofing', label: t('amenities.items.soundproofing'), icon: FaVolumeMute, category: t('amenities.categories.roomFeatures') },
        { id: 'balcony', label: t('amenities.items.balcony'), icon: FaDoorOpen, category: t('amenities.categories.roomFeatures') },
        { id: 'terrace', label: t('amenities.items.terrace'), icon: FaUmbrellaBeach, category: t('amenities.categories.roomFeatures') },
        { id: 'inRoomSafe', label: t('amenities.items.inRoomSafe'), icon: FaLock, category: t('amenities.categories.roomFeatures') },
        { id: 'ironAndBoard', label: t('amenities.items.ironAndBoard'), icon: GiIronMask, category: t('amenities.categories.roomFeatures') },
        { id: 'luggageRack', label: t('amenities.items.luggageRack'), icon: FaSuitcase, category: t('amenities.categories.roomFeatures') },
        { id: 'telephone', label: t('amenities.items.telephone'), icon: FaPhone, category: t('amenities.categories.roomFeatures') },
        { id: 'alarmClock', label: t('amenities.items.alarmClock'), icon: FaClock, category: t('amenities.categories.roomFeatures') },

        // Entertainment
        { id: 'tv', label: t('amenities.items.tv'), icon: FaTv, category: t('amenities.categories.entertainment') },
        { id: 'satelliteTv', label: t('amenities.items.satelliteTv'), icon: FaTv, category: t('amenities.categories.entertainment') },
        { id: 'smartTv', label: t('amenities.items.smartTv'), icon: FaTv, category: t('amenities.categories.entertainment') },
        { id: 'netflix', label: t('amenities.items.netflix'), icon: FaTv, category: t('amenities.categories.entertainment') },
        { id: 'speakers', label: t('amenities.items.speakers'), icon: FaVolumeUp, category: t('amenities.categories.entertainment') },
        { id: 'gameConsole', label: t('amenities.items.gameConsole'), icon: FaGamepad, category: t('amenities.categories.entertainment') },
        { id: 'streamingServices', label: t('amenities.items.streamingServices'), icon: FaFilm, category: t('amenities.categories.entertainment') },
        { id: 'books', label: t('amenities.items.books'), icon: FaBook, category: t('amenities.categories.entertainment') },
        { id: 'boardGames', label: t('amenities.items.boardGames'), icon: GiChessKing, category: t('amenities.categories.entertainment') },
        { id: 'premiumChannels', label: t('amenities.items.premiumChannels'), icon: FaTv, category: t('amenities.categories.entertainment') },
        { id: 'dvdPlayer', label: t('amenities.items.dvdPlayer'), icon: FcDvdLogo, category: t('amenities.categories.entertainment') },

        // Workspace
        { id: 'desk', label: t('amenities.items.desk'), icon: FaLaptopHouse, category: t('amenities.categories.workspace') },
        { id: 'laptopFriendlyDesk', label: t('amenities.items.laptopFriendlyDesk'), icon: FaLaptop, category: t('amenities.categories.workspace') },
        { id: 'officeChair', label: t('amenities.items.officeChair'), icon: FaChair, category: t('amenities.categories.workspace') },
        { id: 'highSpeedWifi', label: t('amenities.items.highSpeedWifi'), icon: FaWifi, category: t('amenities.categories.workspace') },
        { id: 'ethernetConnection', label: t('amenities.items.ethernetConnection'), icon: FaNetworkWired, category: t('amenities.categories.workspace') },
        { id: 'printerAccess', label: t('amenities.items.printerAccess'), icon: FaPrint, category: t('amenities.categories.workspace') },
        { id: 'usbPorts', label: t('amenities.items.usbPorts'), icon: FaUsb, category: t('amenities.categories.workspace') },
        { id: 'powerOutlets', label: t('amenities.items.powerOutlets'), icon: FaPlug, category: t('amenities.categories.workspace') },
        { id: 'stationery', label: t('amenities.items.stationery'), icon: FaPen, category: t('amenities.categories.workspace') },

        // Kitchen & Dining
        { id: 'refrigerator', label: t('amenities.items.refrigerator'), icon: BiFridge, category: t('amenities.categories.kitchenAndDining') },
        { id: 'microwave', label: t('amenities.items.microwave'), icon: FaUtensils, category: t('amenities.categories.kitchenAndDining') },
        { id: 'electricKettle', label: t('amenities.items.electricKettle'), icon: FaCoffee, category: t('amenities.categories.kitchenAndDining') },
        { id: 'toaster', label: t('amenities.items.toaster'), icon: GiToaster, category: t('amenities.categories.kitchenAndDining') },
        { id: 'coffeeMachine', label: t('amenities.items.coffeeMachine'), icon: FaCoffee, category: t('amenities.categories.kitchenAndDining') },
        { id: 'oven', label: t('amenities.items.oven'), icon: FaFire, category: t('amenities.categories.kitchenAndDining') },
        { id: 'stovetop', label: t('amenities.items.stovetop'), icon: FaFire, category: t('amenities.categories.kitchenAndDining') },
        { id: 'diningTable', label: t('amenities.items.diningTable'), icon: GiTable, category: t('amenities.categories.kitchenAndDining') },
        { id: 'kitchenware', label: t('amenities.items.kitchenware'), icon: FaUtensils, category: t('amenities.categories.kitchenAndDining') },
        { id: 'dishwasher', label: t('amenities.items.dishwasher'), icon: MdOutlineCleaningServices, category: t('amenities.categories.kitchenAndDining') },
        { id: 'blender', label: t('amenities.items.blender'), icon: FaBlender, category: t('amenities.categories.kitchenAndDining') },
        { id: 'waterPurifier', label: t('amenities.items.waterPurifier'), icon: FaWater, category: t('amenities.categories.kitchenAndDining') },
        { id: 'wineGlasses', label: t('amenities.items.wineGlasses'), icon: FaWineGlass, category: t('amenities.categories.kitchenAndDining') },
        { id: 'cuttingBoard', label: t('amenities.items.cuttingBoard'), icon: GiKnifeFork, category: t('amenities.categories.kitchenAndDining') },
        { id: 'spices', label: t('amenities.items.spices'), icon: GiSaltShaker, category: t('amenities.categories.kitchenAndDining') },
        { id: 'foodProcessor', label: t('amenities.items.foodProcessor'), icon: FaBlender, category: t('amenities.categories.kitchenAndDining') },

        // Bathroom Facilities
        { id: 'privateBathroom', label: t('amenities.items.privateBathroom'), icon: FaBath, category: t('amenities.categories.bathroomFacilities') },
        { id: 'sharedBathroom', label: t('amenities.items.sharedBathroom'), icon: FaBath, category: t('amenities.categories.bathroomFacilities') },
        { id: 'toiletBidet', label: t('amenities.items.toiletBidet'), icon: FaToilet, category: t('amenities.categories.bathroomFacilities') },
        { id: 'shower', label: t('amenities.items.shower'), icon: FaShower, category: t('amenities.categories.bathroomFacilities') },
        { id: 'bathtub', label: t('amenities.items.bathtub'), icon: FaBath, category: t('amenities.categories.bathroomFacilities') },
        { id: 'jacuzzi', label: t('amenities.items.jacuzzi'), icon: FaHotTub, category: t('amenities.categories.bathroomFacilities') },
        { id: 'towelsAndBathrobes', label: t('amenities.items.towelsAndBathrobes'), icon: FaTshirt, category: t('amenities.categories.bathroomFacilities') },
        { id: 'hairdryer', label: t('amenities.items.hairdryer'), icon: FaCut, category: t('amenities.categories.bathroomFacilities') },
        { id: 'toiletries', label: t('amenities.items.toiletries'), icon: FaSoap, category: t('amenities.categories.bathroomFacilities') },
        { id: 'makeupMirror', label: t('amenities.items.makeupMirror'), icon: GiMirrorMirror, category: t('amenities.categories.bathroomFacilities') },
        { id: 'heatedTowelRack', label: t('amenities.items.heatedTowelRack'), icon: FaTemperatureHigh, category: t('amenities.categories.bathroomFacilities') },
        { id: 'bathroomScale', label: t('amenities.items.bathroomScale'), icon: FaWeight, category: t('amenities.categories.bathroomFacilities') },
        { id: 'rainShower', label: t('amenities.items.rainShower'), icon: FaCloudRain, category: t('amenities.categories.bathroomFacilities') },
        { id: 'showerCap', label: t('amenities.items.showerCap'), icon: FaHatCowboy, category: t('amenities.categories.bathroomFacilities') },
        { id: 'slippers', label: t('amenities.items.slippers'), icon: GiSocks, category: t('amenities.categories.bathroomFacilities') },

        // Technology
        { id: 'smartHome', label: t('amenities.items.smartHome'), icon: FaRobot, category: t('amenities.categories.technology') },
        { id: 'voiceAssistant', label: t('amenities.items.voiceAssistant'), icon: FaMicrophone, category: t('amenities.categories.technology') },
        { id: 'usbCharging', label: t('amenities.items.usbCharging'), icon: FaUsb, category: t('amenities.categories.technology') },
        { id: 'internationalOutlets', label: t('amenities.items.internationalOutlets'), icon: FaPlug, category: t('amenities.categories.technology') },
        { id: 'digitalKey', label: t('amenities.items.digitalKey'), icon: FaKey, category: t('amenities.categories.technology') },
        { id: 'projector', label: t('amenities.items.projector'), icon: FaProjectDiagram, category: t('amenities.categories.technology') },
        { id: 'bluetoothSpeaker', label: t('amenities.items.bluetoothSpeaker'), icon: FaVolumeUp, category: t('amenities.categories.technology') },

        // Family Features
        { id: 'babyCot', label: t('amenities.items.babyCot'), icon: FaBaby, category: t('amenities.categories.familyFeatures') },
        { id: 'highChair', label: t('amenities.items.highChair'), icon: FaChair, category: t('amenities.categories.familyFeatures') },
        { id: 'childSafety', label: t('amenities.items.childSafety'), icon: FaChild, category: t('amenities.categories.familyFeatures') },
        { id: 'babyBath', label: t('amenities.items.babyBath'), icon: FaBath, category: t('amenities.categories.familyFeatures') },
        { id: 'babyMonitor', label: t('amenities.items.babyMonitor'), icon: FaBaby, category: t('amenities.categories.familyFeatures') },
    ];

    // Define property features
    const propertyFeatures = [
        // Essentials
        { id: 'wifi', label: t('amenities.items.freeWifi'), icon: FaWifi, category: t('amenities.categories.essentials') },
        { id: 'airConditioning', label: t('amenities.items.airConditioning'), icon: FaSnowflake, category: t('amenities.categories.essentials') },
        { id: 'heating', label: t('amenities.items.heating'), icon: FaFire, category: t('amenities.categories.essentials') },
        { id: 'fullyEquippedKitchen', label: t('amenities.items.fullyEquippedKitchen'), icon: GiKitchenKnives, category: t('amenities.categories.essentials') },
        { id: 'freeParking', label: t('amenities.items.freeParking'), icon: FaParking, category: t('amenities.categories.essentials') },
        { id: 'elevator', label: t('amenities.items.elevator'), icon: FaArrowUp, category: t('amenities.categories.essentials') },

        // Outdoor
        { id: 'garden', label: t('amenities.items.garden'), icon: FaLeaf, category: t('amenities.categories.outdoor') },
        { id: 'terraceBalcony', label: t('amenities.items.terraceBalcony'), icon: MdBalcony, category: t('amenities.categories.outdoor') },
        { id: 'bbqArea', label: t('amenities.items.bbqArea'), icon: ImSpoonKnife, category: t('amenities.categories.outdoor') },
        { id: 'picnicArea', label: t('amenities.items.picnicArea'), icon: FaUmbrellaBeach, category: t('amenities.categories.outdoor') },
        { id: 'patio', label: t('amenities.items.patio'), icon: FaChair, category: t('amenities.categories.outdoor') },
        { id: 'outdoorFurniture', label: t('amenities.items.outdoorFurniture'), icon: FaChair, category: t('amenities.categories.outdoor') },
        { id: 'beachAccess', label: t('amenities.items.beachAccess'), icon: FaUmbrella, category: t('amenities.categories.outdoor') },
        { id: 'skiAccess', label: t('amenities.items.skiAccess'), icon: FaSkiing, category: t('amenities.categories.outdoor') },
        { id: 'hikingTrails', label: t('amenities.items.hikingTrails'), icon: FaHiking, category: t('amenities.categories.outdoor') },
        { id: 'outdoorPool', label: t('amenities.items.outdoorPool'), icon: FaSwimmingPool, category: t('amenities.categories.outdoor') },
        { id: 'tennisCourt', label: t('amenities.items.tennisCourt'), icon: FaTableTennis, category: t('amenities.categories.outdoor') },
        { id: 'golfCourse', label: t('amenities.items.golfCourse'), icon: FaGolfBall, category: t('amenities.categories.outdoor') },

        // Wellness
        { id: 'indoorPool', label: t('amenities.items.indoorPool'), icon: FaSwimmingPool, category: t('amenities.categories.wellness') },
        { id: 'fitnessCenter', label: t('amenities.items.fitnessCenter'), icon: FaDumbbell, category: t('amenities.categories.wellness') },
        { id: 'spa', label: t('amenities.items.spa'), icon: FaSpa, category: t('amenities.categories.wellness') },
        { id: 'sauna', label: t('amenities.items.sauna'), icon: FaHotTub, category: t('amenities.categories.wellness') },
        { id: 'massage', label: t('amenities.items.massage'), icon: FaHandHoldingHeart, category: t('amenities.categories.wellness') },

        // Laundry
        { id: 'washingMachine', label: t('amenities.items.washingMachine'), icon: GiWashingMachine, category: t('amenities.categories.laundry') },
        { id: 'dryer', label: t('amenities.items.dryer'), icon: MdOutlineLocalLaundryService, category: t('amenities.categories.laundry') },
        { id: 'ironBoard', label: t('amenities.items.ironBoard'), icon: MdIron, category: t('amenities.categories.laundry') },
        { id: 'laundryService', label: t('amenities.items.laundryService'), icon: MdOutlineCleaningServices, category: t('amenities.categories.laundry') },

        // Business
        { id: 'conferenceRoom', label: t('amenities.items.conferenceRoom'), icon: IoMdBusiness, category: t('amenities.categories.business') },
        { id: 'printingScanning', label: t('amenities.items.printingScanning'), icon: BsPrinter, category: t('amenities.categories.business') },
        { id: 'businessCenter', label: t('amenities.items.businessCenter'), icon: FaBriefcase, category: t('amenities.categories.business') },

        // Services
        { id: 'dailyHousekeeping', label: t('amenities.items.dailyHousekeeping'), icon: FaBroom, category: t('amenities.categories.services') },
        { id: 'breakfastIncluded', label: t('amenities.items.breakfastIncluded'), icon: FaCoffee, category: t('amenities.categories.services') },
        { id: 'roomService', label: t('amenities.items.roomService'), icon: FaConciergeBell, category: t('amenities.categories.services') },
        { id: 'restaurant', label: t('amenities.items.restaurant'), icon: FaUtensils, category: t('amenities.categories.services') },
        { id: 'bar', label: t('amenities.items.bar'), icon: FaGlassMartini, category: t('amenities.categories.services') },
        { id: 'groceryDelivery', label: t('amenities.items.groceryDelivery'), icon: FaShoppingBasket, category: t('amenities.categories.services') },
        { id: 'childcare', label: t('amenities.items.childcare'), icon: FaBaby, category: t('amenities.categories.services') },
        { id: 'dryCleaning', label: t('amenities.items.dryCleaning'), icon: FaTshirt, category: t('amenities.categories.services') },
        { id: 'tourDesk', label: t('amenities.items.tourDesk'), icon: FaMap, category: t('amenities.categories.services') },
        { id: 'currencyExchange', label: t('amenities.items.currencyExchange'), icon: FaExchangeAlt, category: t('amenities.categories.services') },
        { id: 'concierge', label: t('amenities.items.concierge'), icon: FaConciergeBell, category: t('amenities.categories.services') },
        { id: 'luggageStorage', label: t('amenities.items.luggageStorage'), icon: FaSuitcase, category: t('amenities.categories.services') },
        { id: '24hFrontDesk', label: t('amenities.items.24hFrontDesk'), icon: FaUserClock, category: t('amenities.categories.services') },

        // Nearby Services
        { id: 'supermarket', label: t('amenities.items.supermarket'), icon: BiStore, category: t('amenities.categories.nearbyServices') },
        { id: 'pharmacy', label: t('amenities.items.pharmacy'), icon: RiMedicineBottleLine, category: t('amenities.categories.nearbyServices') },
        { id: 'atmBank', label: t('amenities.items.atmBank'), icon: RiBankFill, category: t('amenities.categories.nearbyServices') },
        { id: 'publicTransport', label: t('amenities.items.publicTransport'), icon: FaSubway, category: t('amenities.categories.nearbyServices') },
        { id: 'hospital', label: t('amenities.items.hospital'), icon: FaMedkit, category: t('amenities.categories.nearbyServices') },
        { id: 'shoppingCenter', label: t('amenities.items.shoppingCenter'), icon: FaShoppingBasket, category: t('amenities.categories.nearbyServices') },
    ];

    // Get the appropriate items list based on mode
    const getItems = useCallback(() => {
        return mode === 'amenities' ? roomAmenities : propertyFeatures;
    }, [mode]);

    // Load saved items from redux store on component mount
    useEffect(() => {
        if (!selectedProperty?.property_details) return;

        const propertyType = selectedProperty?.type?.type || '';
        const savedItems = mode === 'amenities'
            ? selectedProperty.property_details.amenities?.standard || []
            : selectedProperty.property_details.propertyFeatures?.standard || [];

        const savedCustomItems = mode === 'amenities'
            ? selectedProperty.property_details.amenities?.custom || []
            : selectedProperty.property_details.propertyFeatures?.custom || [];

        // Convert the array of item IDs to a Set for easier manipulation
        setSelectedItems(new Set(savedItems));
        setCustomItems(savedCustomItems);

        // Filter items based on property type
        filterItemsByPropertyType(propertyType);

        // Initialize all categories as expanded by default
        const allItems = getItems();
        const categories = [...new Set(allItems.map(item => item.category))];
        const initialExpandedState = {};
        categories.forEach(category => {
            initialExpandedState[category] = true;
        });
        setExpandedCategories(initialExpandedState);
    }, [selectedProperty, mode, getItems]);

    // Filter items based on property type
    const filterItemsByPropertyType = useCallback((propertyType) => {
        const allItems = getItems();
        let filteredList = [...allItems];

        // Apply property type filtering
        if (hotelTypes.includes(propertyType)) {
            // For hotels, show only hotel-relevant amenities
            if (mode === 'amenities') {
                // Hotel room amenities - exclude certain categories
                filteredList = filteredList.filter(item =>
                    !['Kitchen & Dining', 'Family Features'].includes(item.category)
                );
            } else {
                // Hotel property features - emphasize certain categories
                // No specific filtering needed, show all property features
            }
        } else if (residentialTypes.includes(propertyType)) {
            // For apartments/houses, emphasize residential amenities
            if (mode === 'amenities') {
                // No specific filtering needed, show all amenities
            } else {
                // For property features, prioritize residential features
                // No specific filtering needed, show all property features
            }
        }

        setFilteredItems(filteredList);
    }, [getItems, mode]);

    // Search functionality
    useEffect(() => {
        if (searchTerm.trim() === '') {
            // If no search term, use the property-type filtered items
            filterItemsByPropertyType(selectedProperty?.type?.type || '');
            return;
        }

        const lowercasedSearch = searchTerm.toLowerCase();
        const allItems = getItems();

        const searchResults = allItems.filter(item =>
            item.label.toLowerCase().includes(lowercasedSearch) ||
            item.category.toLowerCase().includes(lowercasedSearch)
        );

        setFilteredItems(searchResults);
    }, [searchTerm, getItems, filterItemsByPropertyType, selectedProperty?.type?.type]);

    // Group items by category for display
    const groupedItems = filteredItems.reduce((groups, item) => {
        const category = item.category;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
        return groups;
    }, {});

    // Toggle item selection
    const toggleItem = useCallback((id) => {
        setSelectedItems(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    }, []);

    // Add custom item
    const addCustomItem = useCallback(() => {
        if (customItem.trim()) {
            setCustomItems(prev => [...prev, customItem.trim()]);
            setCustomItem('');
        }
    }, [customItem]);

    // Remove custom item
    const removeCustomItem = useCallback((index) => {
        setCustomItems(prev => prev.filter((_, i) => i !== index));
    }, []);

    // Toggle category expansion
    const toggleCategory = useCallback((category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    }, []);

    // Save amenities/features
    const saveItems = async () => {
        setIsSaving(true);
        try {
            const payload = {
                propertyId: id,
                [mode === 'amenities' ? 'amenities' : 'propertyFeatures']: {
                    standard: Array.from(selectedItems),
                    custom: customItems
                }
            };

            const updatedProperty = {
                property_details: {
                   ...selectedProperty.property_details,
                    [mode === 'amenities' ? 'amenities' : 'propertyFeatures']: payload[mode === 'amenities' ? 'amenities' : 'propertyFeatures']
                }
            }

            const res = await updateProperty(selectedProperty?._id, updatedProperty);

            if (res.status === 200) {
              dispatch(selectProperty(res.data));
        
            }

            // Optional: Show success toast
            // toast.success('Amenities updated successfully');
        } catch (error) {
            console.error('Error saving amenities:', error);
            // Optional: Show error toast
            // toast.error('Failed to save amenities');
        } finally {
            setIsSaving(false);
        }
    };

    const { title, description } = getComponentInfo();

    return (
        <div className={`w-full mx-auto p-6 bg-white rounded-lg shadow-md `}>
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600">{description}</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder={mode === 'amenities' 
                        ? t('amenities.searchPlaceholder') 
                        : t('amenities.searchPlaceholder')
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 `}
                />
            </div>

            {/* Amenities/Features Grid */}
            <div className="space-y-4 mb-6">
                {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                            className={`flex items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors  `}
                            onClick={() => toggleCategory(category)}
                        >
                            <h3 className="font-medium text-gray-800 flex-grow">{category}</h3>
                            {expandedCategories[category] ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
                        </div>
                        {expandedCategories[category] && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 p-4 bg-white">
                                {items.map(item => (
                                    <div
                                        key={item.id}
                                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors   ${selectedItems.has(item.id)
                                                ? 'bg-green-200 border border-green-400'
                                                : 'hover:bg-gray-100 border border-transparent'
                                            }`}
                                        onClick={() => toggleItem(item.id)}
                                    >
                                        <item.icon className={`w-5 h-5 text-gray-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Custom Item Input */}
            {/* <div className="mb-6">
                <div className="flex space-x-2 mb-3">
                    <input
                        type="text"
                        value={customItem}
                        onChange={(e) => setCustomItem(e.target.value)}
                        placeholder={mode === 'amenities' 
                            ? t('amenities.customAmenityPlaceholder') 
                            : t('propertyFeatures.customFeaturePlaceholder')
                        }
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                        onClick={addCustomItem}
                        disabled={!customItem.trim()}
                        className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <FaPlus />
                    </button>
                </div>
                {customItems.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {customItems.map((item, index) => (
                            <div key={index} className="flex items-center bg-gray-100 rounded-full pl-3 pr-2 py-1">
                                <span className="text-sm mr-2">{item}</span>
                                <button
                                    onClick={() => removeCustomItem(index)}
                                    className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 text-gray-600 hover:bg-gray-400 transition-colors"
                                >
                                    <FaTimes className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div> */}

            {/* Save Button */}
            <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                <button
                    onClick={saveItems}
                    disabled={isSaving}
                    className={`flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                    <span>
                        {isSaving 
                            ? (mode === 'amenities' 
                                ? t('amenities.savingButton') 
                                : t('amenities.savingButton'))
                            : (mode === 'amenities' 
                                ? t('amenities.saveButton') 
                                : t('amenities.saveButton'))
                        }
                    </span>
                    <FaSave />
                </button>
            </div>
        </div>
    );
};

Amenities.propTypes = {
    mode: PropTypes.oneOf(['amenities', 'features'])
};

export default Amenities;