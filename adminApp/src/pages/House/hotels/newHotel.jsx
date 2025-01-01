import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel, faCity, faLocationDot, faMoneyBill, faBed, faStar, faPhone, faWifi, faParking, faSwimmingPool, faUtensils, faDumbbell, faBath, faSnowflake, faKitchenSet, faTv, faPeopleRoof, faWater, faCarSide, faMugHot, faShower, faDesktop, faTvAlt, faElevator, faUmbrella, faUmbrellaBeach, faTree, faGamepad, faMusic, faBicycle, faPersonWalking, faHorse, faBiking, faPersonHiking, faWind, faTableTennis, faConciergeBell, faMoneyBillTransfer, faClock, faBaby, faStore, faScissors, faSmoking, faVolumeXmark, faFireExtinguisher, faShieldHalved, faKey, faSpa, faEye, faToilet, faDoorClosed, faChair, faPlus, faMinus, faPlug, faTable, faSquare, faDoorOpen, faBuilding, faHouse, faStairs, faCamera, faBell, faSmokingBan, faFileInvoice, faCloudUpload, faCalendarDays, faHourglassHalf, faMoon, faMoneyBillWheat, faCouch, faTimes, faBroom, faTshirt } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { City, Neighborhood, Region } from "./Location";

function NewHotel() {
    const navigate = useNavigate()
    const { id } = useParams(); // Get hotel ID from URL parameters
    const [error, setError] = useState(null)
    const [selectedLanguage, setSelectedLanguage] = useState("")
    const [showEnvironment, setShowEnvironment] = useState(false);
    const [environmentSections, setEnvironmentSections] = useState([
        { title: "NearbyPlaces", items: [] },
        { title: "RestaurantsCoffee", items: [] },
        { title: "NearbyBeaches", items: [] },
        { title: "PublicTransport", items: [] },
        { title: "NearbyAirports", items: [] },
    ]);
    const [hotelId, setHotelId] = useState(id || null); // Set hotelId from URL or null

    // location 
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedNeighboorhd, setSelectedNeighboorhd] = useState("");

    // Initial form state
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        type: "",
        location: {
            region: "",
            city: "",
            neighborhood: "",
            latitudeLongitude: "",
            distanceFromCityCenter: "",

        },
        contact: {
            phone: "",
            bookPhone: "",
            email: "",
            website: "",

        },
        description: "",
        rating: 0,
        featured: false,
        pricing: {
            basePrice: "",
        },
        rental: {
            durationType: "",
            customDays: "",
            hasFurniture: false,
        },
        policies: {
            pets: {
                allowed: false
            },
            smoking: {
                allowed: false
            },
            events: {
                allowed: false
            },
            quietHours: {
                enforced: false,
                from: "",
                to: ""
            },
            checkIn: {
                from: "",
                to: ""
            },
            checkOut: {
                from: "",
                to: ""
            }
        },
        languages: ["English", "Arabic", "French"],
        amenities: {
            BasicAmenities: {
                wifi: false,
                parking: false,
                pool: false,
                restaurant: false,
                gym: false,
            },
            RoomFeatures: {
                privateBathroom: false,
                airConditioning: false,
                kitchen: false,
                flatScreenTV: false,
                familyRooms: false,
                washingMachine: false,
                sofa: false,
                desk: false,
                wardrobe: false,
                alarmClock: false,
                socketNearBed: false,
                sofaBed: false,
                clothesRack: false,
                dryingRack: false,
                tileMarbleFloor: false,
                privateEntrance: false,
                fan: false,
                iron: false,
                extraLongBeds: false,
                linens: false,
            },
            Bathroom: {
                shower: false,
                bath: false,
                bidet: false,
                hairdryer: false,
            },
            ParkingOptions: {
                privateParking: false,
                parkingGarage: false,
            },
            KitchenDining: {
                coffeemaker: false,
                oven: false,
                microwave: false,
                refrigerator: false,
                highChair: false,
                diningTable: false,
                toaster: false,
                stovetop: false,
                kitchenware: false,
                electricKettle: false,
                dishwasher: false,
            },
            OutdoorRecreation: {
                picnicArea: false,
                beachfront: false,
                garden: false,
                outdoorPool: false,
                poolView: false,
                beachChairs: false,
                outdoorFurniture: false,
                sunTerrace: false,
                balcony: false,
                patio: false,
                beachAccess: false,
            },
            ActivitiesEntertainment: {
                gamesRoom: false,
                liveMusic: false,
                bikeTours: false,
                walkingTours: false,
                horseRiding: false,
                cycling: false,
                hiking: false,
                windsurfing: false,
                tennis: false,
                billiards: false,
            },
            HotelServices: {
                conciergeService: false,
                currencyExchange: false,
                frontDesk24h: false,
                ironingService: false,
                housekeeping: false,
                drycleaning: false,
                laundry: false,
                airportShuttle: false,
                invoiceProvided: false,
                expressCheckInOut: false,
            },
            BuildingFacilities: {
                elevator: false,
                minimarket: false,
                beautyShop: false,
                smokingArea: false,
                soundproofRooms: false,
                meetingFacilities: false,
                sharedLounge: false,
            },
            SafetySecurity: {
                fireExtinguishers: false,
                security24h: false,
                keyCardAccess: false,
                cctvOutside: false,
                cctvCommonAreas: false,
                securityAlarm: false,
                smokeFree: false,
            },
            Wellness: {
                spa: false,
                steamRoom: false,
                bodyTreatments: false,
                beautyServices: false,
                hammam: false,
            },
        }
    });

    // Add amenity categories configuration
    const amenityCategories = {
        BasicAmenities: {
            title: "Basic Amenities",
            items: [
                { label: "WiFi", name: "wifi", icon: faWifi },
                { label: "Parking", name: "parking", icon: faParking },
                { label: "Pool", name: "pool", icon: faSwimmingPool },
                { label: "Restaurant", name: "restaurant", icon: faUtensils },
                { label: "Gym", name: "gym", icon: faDumbbell },
            ]
        },
        RoomFeatures: {
            title: "Room Features",
            items: [
                { label: "Private Bathroom", name: "privateBathroom", icon: faBath },
                { label: "Air Conditioning", name: "airConditioning", icon: faSnowflake },
                { label: "Kitchen", name: "kitchen", icon: faKitchenSet },
                { label: "Flat Screen TV", name: "flatScreenTV", icon: faTv },
                { label: "Family Rooms", name: "familyRooms", icon: faPeopleRoof },
                { label: "Washing Machine", name: "washingMachine", icon: faTv },
                { label: "Sofa", name: "sofa", icon: faCouch },
                { label: "Desk", name: "desk", icon: faDesktop },
                { label: "Wardrobe", name: "wardrobe", icon: faSpa },
                { label: "Alarm Clock", name: "alarmClock", icon: faClock },
                { label: "Socket Near Bed", name: "socketNearBed", icon: faPlug },
                { label: "Sofa Bed", name: "sofaBed", icon: faCouch },
                { label: "Clothes Rack", name: "clothesRack", icon: faClock },
                { label: "Drying Rack", name: "dryingRack", icon: faTshirt },
                { label: "Tile Marble Floor", name: "tileMarbleFloor", icon: faSquare },
                { label: "Private Entrance", name: "privateEntrance", icon: faDoorOpen },
                { label: "Fan", name: "fan", icon: faClock },
                { label: "Iron", name: "iron", icon: faClock },
                { label: "Extra Long Beds", name: "extraLongBeds", icon: faBed },
                { label: "Linens", name: "linens", icon: faBed },
            ]
        },
        Bathroom: {
            title: "Bathroom",
            items: [
                { label: "Shower", name: "shower", icon: faShower },
                { label: "Bath", name: "bath", icon: faBath },
                { label: "Bidet", name: "bidet", icon: faToilet },
                { label: "Hairdryer", name: "hairdryer", icon: faClock },
            ]
        },
        ParkingOptions: {
            title: "Parking",
            items: [
                { label: "Private Parking", name: "privateParking", icon: faParking },
                { label: "Parking Garage", name: "parkingGarage", icon: faParking },
            ]
        },
        KitchenDining: {
            title: "Kitchen & Dining",
            items: [
                { label: "Coffee Maker", name: "coffeemaker", icon: faClock },
                { label: "Oven", name: "oven", icon: faClock },
                { label: "Microwave", name: "microwave", icon: faClock },
                { label: "Refrigerator", name: "refrigerator", icon: faClock },
                { label: "High Chair", name: "highChair", icon: faClock },
                { label: "Dining Table", name: "diningTable", icon: faTable },
                { label: "Toaster", name: "toaster", icon: faClock },
                { label: "Stovetop", name: "stovetop", icon: faClock },
                { label: "Kitchenware", name: "kitchenware", icon: faKitchenSet },
                { label: "Electric Kettle", name: "electricKettle", icon: faClock },
                { label: "Dishwasher", name: "dishwasher", icon: faClock },
            ]
        },
        OutdoorRecreation: {
            title: "Outdoor & Recreation",
            items: [
                { label: "Picnic Area", name: "picnicArea", icon: faUmbrella },
                { label: "Beachfront", name: "beachfront", icon: faUmbrellaBeach },
                { label: "Garden", name: "garden", icon: faTree },
                { label: "Outdoor Pool", name: "outdoorPool", icon: faSwimmingPool },
                { label: "Pool View", name: "poolView", icon: faSwimmingPool },
                { label: "Beach Chairs", name: "beachChairs", icon: faChair },
                { label: "Outdoor Furniture", name: "outdoorFurniture", icon: faChair },
                { label: "Sun Terrace", name: "sunTerrace", icon: faUmbrella },
                { label: "Balcony", name: "balcony", icon: faUmbrella },
                { label: "Patio", name: "patio", icon: faUmbrella },
                { label: "Beach Access", name: "beachAccess", icon: faUmbrellaBeach },
            ]
        },
        ActivitiesEntertainment: {
            title: "Activities",
            items: [
                { label: "Games Room", name: "gamesRoom", icon: faGamepad },
                { label: "Live Music", name: "liveMusic", icon: faMusic },
                { label: "Bike Tours", name: "bikeTours", icon: faBicycle },
                { label: "Walking Tours", name: "walkingTours", icon: faPersonWalking },
                { label: "Horse Riding", name: "horseRiding", icon: faHorse },
                { label: "Cycling", name: "cycling", icon: faBicycle },
                { label: "Hiking", name: "hiking", icon: faPersonHiking },
                { label: "Windsurfing", name: "windsurfing", icon: faWind },
                { label: "Tennis", name: "tennis", icon: faTableTennis },
                { label: "Billiards", name: "billiards", icon: faTableTennis },
            ]
        },
        HotelServices: {
            title: "Services",
            items: [
                { label: "Concierge Service", name: "conciergeService", icon: faConciergeBell },
                { label: "Currency Exchange", name: "currencyExchange", icon: faMoneyBillTransfer },
                { label: "Front Desk 24h", name: "frontDesk24h", icon: faClock },
                { label: "Ironing Service", name: "ironingService", icon: faBroom },
                { label: "Housekeeping", name: "housekeeping", icon: faBroom },
                { label: "Dry Cleaning", name: "drycleaning", icon: faBroom },
                { label: "Laundry", name: "laundry", icon: faBroom },
                { label: "Airport Shuttle", name: "airportShuttle", icon: faCarSide },
                { label: "Invoice Provided", name: "invoiceProvided", icon: faFileInvoice },
                { label: "Express Check-in/Out", name: "expressCheckInOut", icon: faDoorOpen },
            ]
        },
        BuildingFacilities: {
            title: "Building Facilities",
            items: [
                { label: "Elevator", name: "elevator", icon: faElevator },
                { label: "Mini Market", name: "minimarket", icon: faStore },
                { label: "Beauty Shop", name: "beautyShop", icon: faSpa },
                { label: "Smoking Area", name: "smokingArea", icon: faSmoking },
                { label: "Soundproof Rooms", name: "soundproofRooms", icon: faShieldHalved },
                { label: "Meeting Facilities", name: "meetingFacilities", icon: faPeopleRoof },
                { label: "Shared Lounge", name: "sharedLounge", icon: faChair },
            ]
        },
        SafetySecurity: {
            title: "Safety & Security",
            items: [
                { label: "Fire Extinguishers", name: "fireExtinguishers", icon: faFireExtinguisher },
                { label: "Security 24h", name: "security24h", icon: faShieldHalved },
                { label: "Key Card Access", name: "keyCardAccess", icon: faKey },
                { label: "CCTV Outside", name: "cctvOutside", icon: faCamera },
                { label: "CCTV Common Areas", name: "cctvCommonAreas", icon: faCamera },
                { label: "Security Alarm", name: "securityAlarm", icon: faBell },
                { label: "Smoke Free", name: "smokeFree", icon: faSmokingBan },
            ]
        },
        Wellness: {
            title: "Wellness",
            items: [
                { label: "Spa", name: "spa", icon: faSpa },
                { label: "Steam Room", name: "steamRoom", icon: faClock },
                { label: "Body Treatments", name: "bodyTreatments", icon: faClock },
                { label: "Beauty Services", name: "beautyServices", icon: faSpa },
                { label: "Hammam", name: "hammam", icon: faClock },
            ]
        }
    };

    // Add translations for tooltips (optional)
    const amenityTranslations = {
        wifi: {
            en: "Free WiFi throughout the property",
            ar: "واي فاي"
        },
        parking: {
            en: "On-site parking available",
            ar: "موقف سيارات"
        },
        pool: {
            en: "Swimming pool access",
            ar: "دخول مسبح"
        },
        restaurant: {
            en: "On-site restaurant",
            ar: "مطعم على الموقع"
        },
        gym: {
            en: "Fitness center",
            ar: "مركز رياضة"
        },
        spa: {
            en: "Spa and wellness center",
            ar: "مركز سبا والصحة البدنية"
        },
        airConditioning: {
            en: "Climate control in rooms",
            ar: "تحكم في المناخ في الغرف"
        },
        kitchen: {
            en: "Kitchen facilities",
            ar: "معدات المطبخ"
        },
        tv: {
            en: "Television in rooms",
            ar: "تلفزيون في ال��������������رف"
        },
        elevator: {
            en: "Elevator access",
            ar: "دخول المصعد"
        },
        beachAccess: {
            en: "Direct beach access",
            ar: "دخول مباشر للشطئ"
        },
        garden: {
            en: "Garden area",
            ar: "منطقة حديقة"
        },
        gameRoom: {
            en: "Game room facilities",
            ar: "مرافق الغرفة الألعاب"
        },
        businessCenter: {
            en: "Business center services",
            ar: "خدمات مركز الأعمال"
        },
        laundry: {
            en: "Laundry services",
            ar: "خدمات التنظيف"
        },
        roomService: {
            en: "24/7 room service",
            ar: "خدمة الغرفة 24/7"
        },
        bar: {
            en: "On-site bar",
            ar: "مقهى على الموقع"
        },
        terrace: {
            en: "Terrace area",
            ar: "منطقة الملعب"
        },
        familyRooms: {
            en: "Family-friendly rooms",
            ar: "غرف عائلية"
        },
        sauna: {
            en: "Sauna facilities",
            ar: "مرافق السون��"
        },
        privateBathroom: {
            en: "Private Bathroom",
            ar: "حمام خاص"
        },
        washingMachine: {
            en: "Washing Machine",
            ar: "غسالة"
        },
        sofa: {
            en: "Sofa",
            ar: "مقعد جلدي"
        },
        desk: {
            en: "Desk",
            ar: "مكتب"
        },
        wardrobe: {
            en: "Wardrobe",
            ar: "إبرة"
        },
        alarmClock: {
            en: "Alarm Clock",
            ar: "ساعة صوت"
        },
        socketNearBed: {
            en: "Socket Near Bed",
            ar: "موصل على المنفذ القريب من السرير"
        },
        sofaBed: {
            en: "Sofa Bed",
            ar: "مقعد جلدي"
        },
        clothesRack: {
            en: "Clothes Rack",
            ar: "إبرة"
        },
        dryingRack: {
            en: "Drying Rack",
            ar: "إبرة"
        },
        tileMarbleFloor: {
            en: "Tile Marble Floor",
            ar: "أرضية ماربل"
        },
        privateEntrance: {
            en: "Private Entrance",
            ar: "مدخل خاص"
        },
        fan: {
            en: "Fan",
            ar: "مروحة"
        },
        iron: {
            en: "Iron",
            ar: "ثلاجة"
        },
        extraLongBeds: {
            en: "Extra Long Beds",
            ar: "أسرة طويلة"
        },
        linens: {
            en: "Linens",
            ar: "ملبس"
        },
        shower: {
            en: "Shower",
            ar: "مروحة"
        },
        bath: {
            en: "Bath",
            ar: "حمام"
        },
        bidet: {
            en: "Bidet",
            ar: "بيديت"
        },
        hairdryer: {
            en: "Hairdryer",
            ar: "مكواة الشعر"
        },
        privateParking: {
            en: "Private Parking",
            ar: "موقف خاص"
        },
        parkingGarage: {
            en: "Parking Garage",
            ar: "موقف سيارات"
        },
        coffeemaker: {
            en: "Coffee Maker",
            ar: "ماكينة إسبريسو"
        },
        oven: {
            en: "Oven",
            ar: "فرن"
        },
        microwave: {
            en: "Microwave",
            ar: "ميكرويف"
        },
        refrigerator: {
            en: "Refrigerator",
            ar: "ثلاجة"
        },
        highChair: {
            en: "High Chair",
            ar: "كرسي عالي"
        },
        diningTable: {
            en: "Dining Table",
            ar: "طاولة الطعام"
        },
        toaster: {
            en: "Toaster",
            ar: "توستر"
        },
        stovetop: {
            en: "Stovetop",
            ar: "فرن الطهي"
        },
        kitchenware: {
            en: "Kitchenware",
            ar: "معدات المطبخ"
        },
        electricKettle: {
            en: "Electric Kettle",
            ar: "ميكروفورن"
        },
        dishwasher: {
            en: "Dishwasher",
            ar: "غسالة الأطباق"
        },
        picnicArea: {
            en: "Picnic Area",
            ar: "منطقة الطعام"
        },
        beachfront: {
            en: "Beachfront",
            ar: "شاطئ البحر"
        },
        garden: {
            en: "Garden",
            ar: "حديقة"
        },
        outdoorPool: {
            en: "Outdoor Pool",
            ar: "مسبحة خارجية"
        },
        poolView: {
            en: "Pool View",
            ar: "منظر مسبح"
        },
        beachChairs: {
            en: "Beach Chairs",
            ar: "كراسي ش��طئ"
        },
        outdoorFurniture: {
            en: "Outdoor Furniture",
            ar: "أثاث خارجي"
        },
        sunTerrace: {
            en: "Sun Terrace",
            ar: "ملعب الشمس"
        },
        balcony: {
            en: "Balcony",
            ar: "ملعب"
        },
        patio: {
            en: "Patio",
            ar: "ملعب"
        },
        beachAccess: {
            en: "Beach Access",
            ar: "دخول مباشر للشاطئ"
        },
        gamesRoom: {
            en: "Games Room",
            ar: "غرفة الألعاب"
        },
        liveMusic: {
            en: "Live Music",
            ar: "موسيقى حية"
        },
        bikeTours: {
            en: "Bike Tours",
            ar: "جولات على الدراجات"
        },
        walkingTours: {
            en: "Walking Tours",
            ar: "جولات على المشي"
        },
        horseRiding: {
            en: "Horse Riding",
            ar: "السفر على الموج"
        },
        cycling: {
            en: "Cycling",
            ar: "الدراجات النارية"
        },
        hiking: {
            en: "Hiking",
            ar: "الجولات عل����� الجبال"
        },
        windsurfing: {
            en: "Windsurfing",
            ar: "الركب على الريح"
        },
        tennis: {
            en: "Tennis",
            ar: "التنس"
        },
        billiards: {
            en: "Billiards",
            ar: "البيليارد"
        },
        conciergeService: {
            en: "Concierge Service",
            ar: "خدمة المستشار"
        },
        currencyExchange: {
            en: "Currency Exchange",
            ar: "تبادل العملات"
        },
        frontDesk24h: {
            en: "Front Desk 24h",
            ar: "خدمة المكاتب 24/7"
        },
        ironingService: {
            en: "Ironing Service",
            ar: "خدمة التنظيف"
        },
        housekeeping: {
            en: "Housekeeping",
            ar: "خدمة التنظيف"
        },
        drycleaning: {
            en: "Dry Cleaning",
            ar: "تنظيف جاف"
        },
        laundry: {
            en: "Laundry",
            ar: "تنظيف"
        },
        airportShuttle: {
            en: "Airport Shuttle",
            ar: "النقل الجوي"
        },
        invoiceProvided: {
            en: "Invoice Provided",
            ar: "الف��تو��ة مقدمة"
        },
        expressCheckInOut: {
            en: "Express Check-in/Out",
            ar: "التسجيل السريع"
        },
        elevator: {
            en: "Elevator",
            ar: "المصعد"
        },
        minimarket: {
            en: "Mini Market",
            ar: "متجر صغير"
        },
        beautyShop: {
            en: "Beauty Shop",
            ar: "محل جميلات"
        },
        smokingArea: {
            en: "Smoking Area",
            ar: "منطقة تدخين"
        },
        soundproofRooms: {
            en: "Soundproof Rooms",
            ar: "غرف صامتة"
        },
        meetingFacilities: {
            en: "Meeting Facilities",
            ar: "مرافق الاجتماعات"
        },
        sharedLounge: {
            en: "Shared Lounge",
            ar: "ملعب مشترك"
        },
        fireExtinguishers: {
            en: "Fire Extinguishers",
            ar: "أفران الإطفاء"
        },
        security24h: {
            en: "Security 24h",
            ar: "الأمن 24/7"
        },
        keyCardAccess: {
            en: "Key Card Access",
            ar: "دخول الكارد"
        },
        cctvOutside: {
            en: "CCTV Outside",
            ar: "كاميرات الموقع الخارجي"
        },
        cctvCommonAreas: {
            en: "CCTV Common Areas",
            ar: "كاميرات المناطق المشتركة"
        },
        securityAlarm: {
            en: "Security Alarm",
            ar: "إشارة الأمن"
        },
        smokeFree: {
            en: "Smoke Free",
            ar: "صفر التدخين"
        },
        spa: {
            en: "Spa",
            ar: "مركز سبا"
        },
        steamRoom: {
            en: "Steam Room",
            ar: "مركز البخار"
        },
        bodyTreatments: {
            en: "Body Treatments",
            ar: "تدليك"
        },
        beautyServices: {
            en: "Beauty Services",
            ar: "خدمات الجمال"
        },
        hammam: {
            en: "Hammam",
            ar: "هامم"
        }
    };

    // Add new handler for check-in/out times
    const handleTimeChange = (e, type) => {
        const { name, value } = e.target;
        const [parent, child, timeType] = name.split('.');

        setFormData(prev => {
            const currentTimes = prev[parent][child];
            const newTimes = { ...currentTimes, [timeType]: value };

            // Validate time ranges
            if (type === 'checkIn') {
                if (timeType === 'from' && newTimes.to && value >= newTimes.to) {
                    setError('Check-in start time must be before end time');
                    return prev;
                }
            } else if (type === 'checkOut') {
                if (timeType === 'from' && newTimes.to && value >= newTimes.to) {
                    setError('Check-out start time must be before end time');
                    return prev;
                }
            }

            setError(null);
            return {
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: newTimes
                }
            };
        });
    };

    // Update existing handleChange function
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle time inputs separately
        if (name.includes('checkIn') || name.includes('checkOut')) {
            const timeType = name.includes('checkIn') ? 'checkIn' : 'checkOut';
            handleTimeChange(e, timeType);
            return;
        }

        // Handle policy toggles specifically
        if (name.startsWith('policies.')) {
            const [_, policy, field] = name.split('.');
            setFormData(prev => ({
                ...prev,
                policies: {
                    ...prev.policies,
                    [policy]: {
                        ...prev.policies[policy],
                        [field]: type === 'checkbox' ? checked : value
                    }
                }
            }));
            return;
        }

        // Handle amenities specifically
        if (name.startsWith('amenities.')) {
            const [category, amenityName] = name.split('.')[1].split('.');
            setFormData(prev => ({
                ...prev,
                amenities: {
                    ...prev.amenities,
                    [category]: {
                        ...prev.amenities[category],
                        [amenityName]: checked
                    }
                }
            }))
            return
        }

        // Handle nested object properties
        if (name.includes('.')) {
            const [parent, child] = name.split('.')
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }))
        }

        // Handle customDays specifically to ensure it's a string
        if (name === 'rental.customDays') {
            setFormData(prev => ({
                ...prev,
                rental: {
                    ...prev.rental,
                    customDays: value ? String(value) : "" // Convert to string or set to empty string
                }
            }));
            return;
        }
    }

    const handleReset = () => {
        setFormData({
            name: "",
            title: "",
            type: "",
            location: {
                region: "",
                city: "",
                neighborhood: "",
                latitudeLongitude: "",
                distanceFromCityCenter: "",
            },
            description: "",
            status: "",
            rating: 0,
            featured: false,
            contact: {
                phone: "",
                bookPhone: "",
                email: "",
                website: "",
            },
            pricing: {
                basePrice: "",
            },
            rental: {
                durationType: "",
                customDays: "",
                hasFurniture: false,
            },
            policies: {
                pets: {
                    allowed: false
                },
                smoking: {
                    allowed: false
                },
                events: {
                    allowed: false
                },
                quietHours: {
                    enforced: false,
                    from: "",
                    to: ""
                },
                checkIn: {
                    from: "",
                    to: ""
                },
                checkOut: {
                    from: "",
                    to: ""
                }
            },
            languages: [],
            photos: [],
            rooms: [],
            amenities: {
                BasicAmenities: {
                    wifi: false,
                    parking: false,
                    pool: false,
                    restaurant: false,
                    gym: false,
                },
                RoomFeatures: {
                    privateBathroom: false,
                    airConditioning: false,
                    kitchen: false,
                    flatScreenTV: false,
                    familyRooms: false,
                    washingMachine: false,
                    sofa: false,
                    desk: false,
                    wardrobe: false,
                    alarmClock: false,
                    socketNearBed: false,
                    sofaBed: false,
                    clothesRack: false,
                    dryingRack: false,
                    tileMarbleFloor: false,
                    privateEntrance: false,
                    fan: false,
                    iron: false,
                    extraLongBeds: false,
                    linens: false,
                },
                Bathroom: {
                    shower: false,
                    bath: false,
                    bidet: false,
                    hairdryer: false,
                },
                ParkingOptions: {
                    privateParking: false,
                    parkingGarage: false,
                },
                KitchenDining: {
                    coffeemaker: false,
                    oven: false,
                    microwave: false,
                    refrigerator: false,
                    highChair: false,
                    diningTable: false,
                    toaster: false,
                    stovetop: false,
                    kitchenware: false,
                    electricKettle: false,
                    dishwasher: false,
                },
                OutdoorRecreation: {
                    picnicArea: false,
                    beachfront: false,
                    garden: false,
                    outdoorPool: false,
                    poolView: false,
                    beachChairs: false,
                    outdoorFurniture: false,
                    sunTerrace: false,
                    balcony: false,
                    patio: false,
                    beachAccess: false,
                },
                ActivitiesEntertainment: {
                    gamesRoom: false,
                    liveMusic: false,
                    bikeTours: false,
                    walkingTours: false,
                    horseRiding: false,
                    cycling: false,
                    hiking: false,
                    windsurfing: false,
                    tennis: false,
                    billiards: false,
                },
                HotelServices: {
                    conciergeService: false,
                    currencyExchange: false,
                    frontDesk24h: false,
                    ironingService: false,
                    housekeeping: false,
                    drycleaning: false,
                    laundry: false,
                    airportShuttle: false,
                    invoiceProvided: false,
                    expressCheckInOut: false,
                },
                BuildingFacilities: {
                    elevator: false,
                    minimarket: false,
                    beautyShop: false,
                    smokingArea: false,
                    soundproofRooms: false,
                    meetingFacilities: false,
                    sharedLounge: false,
                },
                SafetySecurity: {
                    fireExtinguishers: false,
                    security24h: false,
                    keyCardAccess: false,
                    cctvOutside: false,
                    cctvCommonAreas: false,
                    securityAlarm: false,
                    smokeFree: false,
                },
                Wellness: {
                    spa: false,
                    steamRoom: false,
                    bodyTreatments: false,
                    beautyServices: false,
                    hammam: false,
                },
            }
        })
        setSelectedLanguage("")
    }

    const handleAddLanguage = () => {
        if (selectedLanguage && !formData.languages.includes(selectedLanguage)) {
            setFormData(prev => ({
                ...prev,
                languages: [...prev.languages, selectedLanguage]
            }))
            setSelectedLanguage("")
        }
    }

    const handleRemoveLanguage = (languageToRemove) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.filter(lang => lang !== languageToRemove)
        }))
    }

    const handleQuietHoursToggle = (e) => {
        const { checked } = e.target;

        setFormData(prev => ({
            ...prev,
            policies: {
                ...prev.policies,
                quietHours: {
                    ...prev.policies.quietHours,
                    enforced: checked,
                    // Keep existing times when toggling
                    from: checked ? (prev.policies.quietHours.from || "22:00") : "",
                    to: checked ? (prev.policies.quietHours.to || "07:00") : ""
                }
            }
        }));
    };

    const availableLanguages = [
        "Arabic",
        "English",
        "French",
        "Spanish",
        "German",
        "Italian",
        "Chinese",
        "Japanese",
        "Russian",
        "Turkish",
        "Hindi",
        "Portuguese",
        "Korean",
        "Dutch"
    ];

    useEffect(() => {
        // Fetch hotel data if hotelId is provided
        if (hotelId) {
            const fetchHotelData = async () => {
                try {
                    const response = await axios.get(`/api/hotels/find/${hotelId}`);

                    setSelectedRegion(response.data.location?.region || "")
                    setSelectedCity(response.data.location?.city || "")
                    setSelectedNeighboorhd(response.data.location?.neighborhood || "")

                    setFormData({
                        name: response.data.name || "",
                        title: response.data.title || "",
                        type: response.data.type || "",
                        location: {
                            region: selectedRegion || "",
                            city: selectedCity || "",
                            neighborhood: selectedNeighboorhd || "",
                            latitudeLongitude: response.data.location?.latitudeLongitude || "",
                            distanceFromCityCenter: response.data.location?.distanceFromCityCenter || "",

                        },
                        contact: {
                            phone: response.data.contact?.phone || "",
                            bookPhone: response.data.contact?.bookPhone || "",
                            email: response.data.contact?.email || "",
                            website: response.data.contact?.website || "",
                        },
                        description: response.data.description || "",
                        rating: response.data.rating || 0,
                        featured: response.data.featured || false,
                        pricing: {
                            basePrice: response.data.basePrice || "",
                        },
                        rental: {
                            durationType: response.data.rental?.durationType || "",
                            customDays: response.data.rental?.customDays || "",
                            hasFurniture: response.data.rental?.hasFurniture || false,
                        },
                        policies: {
                            pets: {
                                allowed: response.data.policies?.pets?.allowed || false
                            },
                            smoking: {
                                allowed: response.data.policies?.smoking?.allowed || false
                            },
                            events: {
                                allowed: response.data.policies?.events?.allowed || false
                            },
                            quietHours: {
                                enforced: response.data.policies?.quietHours?.enforced || false,
                                from: response.data.policies?.quietHours?.from || "22:00",
                                to: response.data.policies?.quietHours?.to || "07:00"
                            },
                            checkIn: {
                                from: response.data.policies?.checkIn?.from || "",
                                to: response.data.policies?.checkIn?.to || ""
                            },
                            checkOut: {
                                from: response.data.policies?.checkOut?.from || "",
                                to: response.data.policies?.checkOut?.to || ""
                            }
                        },
                        languages: response.data.languages || [],
                        amenities: response.data.amenities || {
                            BasicAmenities: {
                                wifi: false,
                                parking: false,
                                pool: false,
                                restaurant: false,
                                gym: false,
                            },
                            RoomFeatures: {
                                privateBathroom: false,
                                airConditioning: false,
                                kitchen: false,
                                flatScreenTV: false,
                                familyRooms: false,
                                washingMachine: false,
                                sofa: false,
                                desk: false,
                                wardrobe: false,
                                alarmClock: false,
                                socketNearBed: false,
                                sofaBed: false,
                                clothesRack: false,
                                dryingRack: false,
                                tileMarbleFloor: false,
                                privateEntrance: false,
                                fan: false,
                                iron: false,
                                extraLongBeds: false,
                                linens: false,
                            },
                            Bathroom: {
                                shower: false,
                                bath: false,
                                bidet: false,
                                hairdryer: false,
                            },
                            ParkingOptions: {
                                privateParking: false,
                                parkingGarage: false,
                            },
                            KitchenDining: {
                                coffeemaker: false,
                                oven: false,
                                microwave: false,
                                refrigerator: false,
                                highChair: false,
                                diningTable: false,
                                toaster: false,
                                stovetop: false,
                                kitchenware: false,
                                electricKettle: false,
                                dishwasher: false,
                            },
                            OutdoorRecreation: {
                                picnicArea: false,
                                beachfront: false,
                                garden: false,
                                outdoorPool: false,
                                poolView: false,
                                beachChairs: false,
                                outdoorFurniture: false,
                                sunTerrace: false,
                                balcony: false,
                                patio: false,
                                beachAccess: false,
                            },
                            ActivitiesEntertainment: {
                                gamesRoom: false,
                                liveMusic: false,
                                bikeTours: false,
                                walkingTours: false,
                                horseRiding: false,
                                cycling: false,
                                hiking: false,
                                windsurfing: false,
                                tennis: false,
                                billiards: false,
                            },
                            HotelServices: {
                                conciergeService: false,
                                currencyExchange: false,
                                frontDesk24h: false,
                                ironingService: false,
                                housekeeping: false,
                                drycleaning: false,
                                laundry: false,
                                airportShuttle: false,
                                invoiceProvided: false,
                                expressCheckInOut: false,
                            },
                            BuildingFacilities: {
                                elevator: false,
                                minimarket: false,
                                beautyShop: false,
                                smokingArea: false,
                                soundproofRooms: false,
                                meetingFacilities: false,
                                sharedLounge: false,
                            },
                            SafetySecurity: {
                                fireExtinguishers: false,
                                security24h: false,
                                keyCardAccess: false,
                                cctvOutside: false,
                                cctvCommonAreas: false,
                                securityAlarm: false,
                                smokeFree: false,
                            },
                            Wellness: {
                                spa: false,
                                steamRoom: false,
                                bodyTreatments: false,
                                beautyServices: false,
                                hammam: false,
                            },
                        }
                    });
                } catch (error) {
                    setError('Error fetching hotel data');
                }
            };
            fetchHotelData();
        }
    }, [hotelId]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log()

        try {
            // Validate check-in and check-out times
            // ... existing validation code ...

            // Transform formData to match schema structure
            const hotelData = {
                name: formData.name,
                title: formData.title,
                type: formData.type,
                location: {

                    region: selectedRegion,
                    city: selectedCity,
                    neighborhood: selectedNeighboorhd,
                    latitudeLongitude: formData.location.latitudeLongitude,
                    distanceFromCityCenter: Number(formData.location.distanceFromCityCenter),
                },
                contact: {
                    phone: formData.contact.phone,
                    bookPhone: formData.contact.bookPhone,
                    website: formData.contact.website,
                    email: formData.contact.email,
                },
                description: formData.description,
                rating: Number(formData.rating),
                basePrice: Number(formData.pricing.basePrice),
                rental: {
                    durationType: formData.rental.durationType,
                    customDays: formData.rental.durationType === 'custom' ? Number(formData.rental.customDays) : undefined,
                    hasFurniture: formData.rental.durationType === 'month' ? formData.rental.hasFurniture : undefined,
                },
                policies: {
                    pets: { allowed: formData.policies.pets.allowed },
                    smoking: { allowed: formData.policies.smoking.allowed },
                    events: { allowed: formData.policies.events.allowed },
                    quietHours: {
                        enforced: formData.policies.quietHours.enforced,
                        from: formData.policies.quietHours.enforced ? formData.policies.quietHours.from : undefined,
                        to: formData.policies.quietHours.enforced ? formData.policies.quietHours.to : undefined,
                    },
                    checkIn: {
                        from: formData.policies.checkIn.from,
                        to: formData.policies.checkIn.to,
                    },
                    checkOut: {
                        from: formData.policies.checkOut.from,
                        to: formData.policies.checkOut.to,
                    },
                },
                languages: formData.languages,
                featured: formData.featured,
                photos: [], // Initialize empty arrays for photos
                rooms: [], // Initialize empty arrays for rooms
                amenities: formData.amenities,
                proximity: {
                    nearbyPlaces: environmentSections[0].items.map(item => ({
                        name: item.name,
                        distance: item.distance,
                    })),
                    restaurants: environmentSections[1].items.map(item => ({
                        name: item.name,
                        distance: item.distance,
                    })),
                    publicTransit: environmentSections[3].items.map(item => ({
                        name: item.name,
                        distance: item.distance,
                    })),
                    beaches: environmentSections[2].items.map(item => ({
                        name: item.name,
                        distance: item.distance,
                    })),
                    airports: environmentSections[4].items.map(item => ({
                        name: item.name,
                        distance: item.distance,
                    })),
                },
            };

            console.log(hotelData)

            if (hotelId) {
                // Update existing hotel
                const response = await axios.put(`/api/hotels/${hotelId}`, hotelData);
            } else {
                // Create new hotel
                const response = await axios.post('/api/hotels', hotelData);
            }

            // Redirect to hotel list or detail page
            navigate('/hotels');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error processing request');
            console.error('Error processing request:', err);
        }
    };

    const toggleEnvironment = () => {
        setShowEnvironment(prev => !prev);
    };

    const addEnvironmentItem = (index) => {
        const newSections = [...environmentSections];
        newSections[index].items.push({ name: '', distance: '' });
        setEnvironmentSections(newSections);
    };

    const removeEnvironmentItem = (sectionIndex, itemIndex) => {
        const newSections = [...environmentSections];
        newSections[sectionIndex].items.splice(itemIndex, 1);
        setEnvironmentSections(newSections);
    };

    const handleEnvironmentChange = (sectionIndex, itemIndex, field, value) => {
        const newSections = [...environmentSections];
        newSections[sectionIndex].items[itemIndex][field] = value;
        setEnvironmentSections(newSections);
    };

    // Ensure to check for customDays as a string before using trim
    const customDaysValue = String(formData.rental.customDays).trim(); // Convert to string before trimming

    // Add a function to handle the addition of amenities
    const handleAmenityChange = (category, name, checked) => {
        setFormData(prev => ({
            ...prev,
            amenities: {
                ...prev.amenities,
                [category]: {
                    ...prev.amenities[category],
                    [name]: checked
                }
            }
        }));
    };

    return (
        <div className="mx-auto  px-4 sm:px-6 lg:px-8">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="py-10">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-cyan-500">
                            <FontAwesomeIcon icon={faHotel} className="mr-2" />
                            Add New Property
                        </h1>
                        <Link to="/hotels" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            View All Properties
                        </Link>
                    </div>

                    

                    <div className="space-y-6   p-12 bg-white">
                        <div className="">
                            <div className="space-y-4 grid gap-6 mb-6 md:grid-cols-3">
                                <div className="bg-white rounded-lg p-4 mt-4">
                                    <label className="block text-md mb-3 font-medium text-gray-700">
                                        <FontAwesomeIcon icon={faHotel} className="mr-2" />
                                        Property Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Hilton Garden Inn"
                                        className={`${formData.name.trim() !== "" ? "bg-blue-100 text-black" : "bg-gray-700 "}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mb-0`}
                                        required
                                    />
                                </div>




                                <div className="bg-white rounded-lg p-4 ">
                                    <label className="block text-md mb-3 font-medium text-gray-700">
                                        <FontAwesomeIcon icon={faHotel} className="mr-2" />
                                        Hotel Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Luxury Beach Resort & Spa"
                                        className={`${formData.title.trim() !== "" ? "bg-blue-100 text-black" : "bg-gray-700 "}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mb-0`}
                                        required
                                    />
                                </div>





                                <div className="bg-white rounded-lg p-4 ">
                                    <label className="block text-md mb-3 font-medium text-gray-700">
                                        <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                                        Starting Price per Night
                                    </label>
                                    <input
                                        type="number"
                                        name="pricing.basePrice"
                                        value={formData.pricing.basePrice}
                                        onChange={handleChange}
                                        placeholder="e.g. 100"
                                        className={`${formData.pricing.basePrice !== 0 ? "bg-blue-100 text-black" : "bg-gray-700 "}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mb-0`}
                                        required
                                    />
                                </div>

                                <div className="bg-white rounded-lg p-4 ">
                                    <label className="block text-md mb-3 font-medium text-gray-700">
                                        <FontAwesomeIcon icon={faBed} className="mr-2" />
                                        Property Type
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className={`${formData.type.trim() !== "" ? "bg-blue-100 text-black" : "bg-gray-700 text-white "}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mb-0`}
                                        required
                                    >
                                        <option value="">Select Property Type</option>
                                        <option value="hotel">Hotel</option>
                                        <option value="apartment">Apartment</option>
                                        <option value="resort">Resort</option>
                                        <option value="villa">Villa</option>
                                        <option value="cabin">Cabin</option>
                                        <option value="guesthouse">Guesthouse</option>
                                        <option value="hostel">Hostel</option>
                                        <option value="boutique">Boutique Hotel</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-white rounded-lg p-4 ">
                                        <label className="block text-md mb-3 font-medium text-gray-700">
                                            <FontAwesomeIcon icon={faStar} className="mr-2" />
                                            Hotel Rating
                                        </label>
                                        <div className="flex items-center justify-between gap-2 mt-2">
                                            <input
                                                type="number"
                                                name="rating"
                                                value={formData.rating}
                                                onChange={handleChange}
                                                min="0"
                                                max="5"
                                                step="0.1"
                                                className={`${(formData.rating !== 0 && formData.rating !== null) ? "bg-blue-100 text-black" : "bg-gray-700 text-white"}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mb-0`}
                                                required
                                            />
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <FontAwesomeIcon
                                                        key={star}
                                                        icon={faStar}
                                                        className={`text-xl ${star <= Math.round(formData.rating)
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                (0-5 stars)
                                            </span>
                                        </div>
                                    </div>
                                </div>


                                <div className="space-y-4 flex items-center justify-between w-full">
                                    <div className="bg-white rounded-lg p-4 ">
                                        <label className="block text-md mb-3 font-medium text-gray-700">
                                            <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
                                            Rental Duration Type
                                        </label>
                                        <select
                                            name="rental.durationType"
                                            value={formData.rental.durationType}
                                            onChange={handleChange}
                                            className={`${formData.rental.durationType.trim() !== "" ? "bg-blue-100 text-black" : "bg-gray-700  text-white"}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mb-0`}
                                            required
                                        >
                                            <option value="">Select Duration Type</option>
                                            <option value="night">Per Night</option>
                                            <option value="month">Per Month</option>
                                            <option value="custom">Custom Days</option>
                                        </select>
                                    </div>

                                    {formData.rental.durationType === 'month' && (
                                        <div className="flex items-center space-x-2">
                                            <FontAwesomeIcon icon={faCouch} className="text-gray-500" />
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="rental.hasFurniture"
                                                    checked={formData.rental.hasFurniture}
                                                    onChange={handleChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                <span className="ml-3 text-md mb-3 font-medium text-gray-700">
                                                    {formData.rental.hasFurniture ? 'Furnished' : 'Unfurnished'}
                                                </span>
                                            </label>
                                        </div>
                                    )}

                                    {formData.rental.durationType === 'custom' && (
                                        <div className="bg-white rounded-lg p-4 ">
                                            <label className="block text-md mb-3 font-medium text-gray-700">
                                                <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
                                                Number of Days
                                            </label>
                                            <input
                                                type="number"
                                                name="rental.customDays"
                                                value={formData.rental.customDays}
                                                onChange={handleChange}
                                                min="1"
                                                className={`${formData.rental.customDays !== 0 ? "bg-blue-100 text-black" : "bg-gray-700 "}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mb-0`} placeholder="0"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* loaction */}
                            <h4 className="text-3xl text-center bg-yellow-500  rounded-t-lg">Location</h4>
                            <div className="space-y-4 grid gap-6 mb-6 md:grid-cols-5 border-b-2 border-yellow-500 rounded-lg" >
                                <Region onRegionSelect={setSelectedRegion} regionValue={selectedRegion} onCitySelect={setSelectedCity} />
                                <City region={selectedRegion} onCitySelect={setSelectedCity} cityValue = {selectedCity} onNeighborhoodSelect={setSelectedNeighboorhd} />
                                <Neighborhood  city={selectedCity} onNeighborhoodSelect={setSelectedNeighboorhd} neighborhoodValue = {selectedNeighboorhd}  />


                                

                                <div className="bg-white rounded-lg p-4 ">
                                    <label className="block text-md mb-3 font-medium text-gray-700">
                                        Dis from Center (km)
                                    </label>
                                    <input
                                        type="number"
                                        name="location.distanceFromCityCenter"
                                        value={formData.location.distanceFromCityCenter}
                                        onChange={handleChange}
                                        placeholder="e.g. 2.5"
                                        className={`${formData.location.distanceFromCityCenter !== 0 ? "bg-blue-100 text-black" : "bg-gray-700 "}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mb-0`}
                                        required
                                    />
                                </div>

                            
                                <div className="bg-white rounded-lg p-4 ">
                                    <label className="block text-md mb-3 font-medium text-gray-700">
                                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                        latitudeLongitude
                                    </label>
                                    <input
                                        type="text"
                                        name="location.latitudeLongitude"
                                        value={formData.location.latitudeLongitude}
                                        onChange={handleChange}
                                        placeholder="e.g. +1234567890"
                                        className={`${formData.location.latitudeLongitude !== 0 ? "bg-blue-100 text-black" : "bg-gray-700 "}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mb-0`}

                                    />
                                </div>
                            </div>

                            {/* contact */}

                            <h4 className="text-3xl text-center bg-orange-500  rounded-t-lg">Contact</h4>
                            <div className="space-y-4 grid gap-6 mb-6 md:grid-cols-4 border-b-2 border-orange-500 rounded-lg" >
                                <div className="bg-white rounded-lg p-4 mt-4 ">
                                    <label className="block text-md mb-3 font-medium text-gray-700">
                                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="contact.phone"
                                        value={formData.contact.phone}
                                        onChange={handleChange}
                                        placeholder="e.g. +1234567890"
                                        className={`${formData.contact.phone.trim() !== "" ? "bg-blue-100 text-black" : "bg-gray-700 "}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mb-0`}
                                        required
                                    />
                                </div>
                                <div className="bg-white rounded-lg p-4 ">
                                    <label className="block text-md mb-3 font-medium text-gray-700">
                                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                        Booking Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="contact.bookPhone"
                                        value={formData.contact.bookPhone}
                                        onChange={handleChange}
                                        placeholder="e.g. +1234567890"
                                        className={`${formData.contact.bookPhone.trim() !== "" ? "bg-blue-100 text-black" : "bg-gray-700 "}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mb-0`}
                                        required
                                    />
                                </div>

                                <div className="bg-white rounded-lg p-4 ">
                                    <label className="block text-md mb-3 font-medium text-gray-700">
                                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="contact.email"
                                        value={formData.contact.email}
                                        onChange={handleChange}
                                        placeholder="e.g. +1234567890"
                                        className={`${formData.contact.email.trim() !== "" ? "bg-blue-100 text-black" : "bg-gray-700 "}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mb-0`}
                                        required
                                    />
                                </div>

                                <div className="bg-white rounded-lg p-4 ">
                                    <label className="block text-md mb-3 font-medium text-gray-700">
                                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                        WebSite
                                    </label>
                                    <input
                                        type="text"
                                        name="contact.website"
                                        value={formData.contact.website}
                                        onChange={handleChange}
                                        placeholder="e.g. +1234567890"
                                        className={`${formData.contact.website.trim() !== "" ? "bg-blue-100 text-black" : "bg-gray-700 "}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mb-0`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">


                                <div className="bg-white rounded-lg p-4 ">
                                    <label className="block text-md mb-3 font-medium text-gray-700">
                                        <FontAwesomeIcon icon={faHotel} className="mr-2" />
                                        Description
                                    </label>
                                    <textarea value={formData?.description} id="message" rows="4" name="description" onChange={handleChange} className={`${formData.description.trim() !== "" ? "bg-blue-100 text-black" : "bg-gray-700 "}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  mb-0`} placeholder="Write your thoughts here..."></textarea>
                                </div>

                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-md mb-3 font-medium text-gray-700">
                                    Property Policies
                                    <span className="block text-sm text-gray-500 mt-1" dir="rtl" lang="ar">
                                        سياسات العقار
                                    </span>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Pets Policy */}

                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Check-in Time Range</label>
                                        <div className="flex gap-2">
                                            <div>
                                                <label className="text-xs text-gray-500">From</label>
                                                <input
                                                    type="time"
                                                    name="policies.checkIn.from"
                                                    value={formData.policies.checkIn.from}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full px-4 bg-transparent hover:border-red-500 py-2 outline-none focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">To</label>
                                                <input
                                                    type="time"
                                                    name="policies.checkIn.to"
                                                    value={formData.policies.checkIn.to}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full px-4 bg-transparent hover:border-red-500 py-2 outline-none focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {error && error.includes('Check-in') && (
                                            <p className="text-red-500 text-xs mt-1">{error}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Check-out Time Range</label>
                                        <div className="flex gap-2">
                                            <div>
                                                <label className="text-xs text-gray-500">From</label>
                                                <input
                                                    type="time"
                                                    name="policies.checkOut.from"
                                                    value={formData.policies.checkOut.from}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full px-4 bg-transparent hover:border-red-500 py-2 outline-none focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">To</label>
                                                <input
                                                    type="time"
                                                    name="policies.checkOut.to"
                                                    value={formData.policies.checkOut.to}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full px-4 bg-transparent hover:border-red-500 py-2 outline-none focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {error && error.includes('Check-out') && (
                                            <p className="text-red-500 text-xs mt-1">{error}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium">Pets Policy</span>
                                            <span className="text-sm text-gray-500" dir="rtl" lang="ar">سياسة الحيوانات الأليفة</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="policies.pets.allowed"
                                                checked={formData.policies.pets.allowed || false}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                {formData.policies.pets.allowed ? 'Allowed' : 'Not Allowed'}
                                            </span>
                                        </label>
                                    </div>

                                </div>

                                {/* Smoking Policy */}
                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium">Smoking Policy</span>
                                            <span className="text-sm text-gray-500" dir="rtl" lang="ar">قواعد التدخين</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="policies.smoking.allowed"
                                                checked={formData.policies.smoking.allowed || false}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                {formData.policies.smoking.allowed ? 'Allowed' : 'Not Allowed'}
                                            </span>
                                        </label>
                                    </div>

                                </div>

                                {/* Events Policy */}
                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium">Events & Parties</span>
                                            <span className="text-sm text-gray-500" dir="rtl" lang="ar">سياسة الحفلات والفعاليات</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="policies.events.allowed"
                                                checked={formData.policies.events.allowed || false}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                {formData.policies.events.allowed ? 'Allowed' : 'Not Allowed'}
                                            </span>
                                        </label>
                                    </div>

                                </div>

                                {/* Quiet Hours Policy */}
                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium">Quiet Hours</span>
                                            <span className="text-sm text-gray-500" dir="rtl" lang="ar">ق����اعد الضوضاء وساعات ا��هد��ء</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="policies.quietHours.enforced"
                                                checked={formData.policies.quietHours.enforced}
                                                onChange={handleQuietHoursToggle}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                {formData.policies.quietHours.enforced ? 'Enforced' : 'Not Enforced'}
                                            </span>
                                        </label>
                                    </div>

                                    {formData.policies.quietHours.enforced && (
                                        <div className="mt-3 animate-fade-in">
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500">From</label>
                                                    <input
                                                        type="time"
                                                        name="policies.quietHours.from"
                                                        value={formData.policies.quietHours.from}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-cyan-54 bg-cyan-100 hover:bg-blue-200 py-2 border-b-2 border-cyan-500 outline-none focus:border-black rounded"
                                                        required={formData.policies.quietHours.enforced}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500">To</label>
                                                    <input
                                                        type="time"
                                                        name="policies.quietHours.to"
                                                        value={formData.policies.quietHours.to}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-cyan-54 bg-cyan-100 hover:bg-blue-200 py-2 border-b-2 border-cyan-500 outline-none focus:border-black rounded"
                                                        required={formData.policies.quietHours.enforced}
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                <span className="block">Quiet hours will be enforced during this time period</span>
                                                <span className="block" dir="rtl" lang="ar">سيتم تطبيق ساعات الهدوء خلال هذه الفترة</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                                Feature this Property
                            </label>
                        </div>

                        <div className="space-y-4 mb-6  bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-700">Languages Spoken</h3>
                            <div className="flex">
                                <div className="flex gap-4 items-center flex-[1] p-6">
                                    <select
                                        value={selectedLanguage}
                                        onChange={(e) => setSelectedLanguage(e.target.value)}
                                        className="flex-1 pxcyan-5y-2 cyang-blue-100 focus:bg-blue-200 border-b-2 border-cyan-500 outline-none focus:border-black"
                                    >
                                        <option value="">Select a language</option>
                                        {availableLanguages
                                            .filter(lang => !formData.languages.includes(lang))
                                            .map(lang => (
                                                <option key={lang} value={lang}>{lang}</option>
                                            ))
                                        }
                                    </select>
                                    <button
                                        type="button"
                                        onClick={handleAddLanguage}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Add Language
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 flex-[1] p-6">
                                    {formData.languages.map(language => (
                                        <span
                                            key={language}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                                        >
                                            {language}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveLanguage(language)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-700">
                                Amenities
                                <span className="block text-sm text-gray-500 mt-1" dir="rtl" lang="ar">
                                    المرافق والخدمات
                                </span>
                            </h3>
                            {Object.entries(amenityCategories).map(([category, { title, items }]) => (
                                <div key={category} className="space-y-2">
                                    <h4 className="font-medium text-gray-600">
                                        {title}
                                        <span className="block text-sm text-gray-500" dir="rtl" lang="ar">
                                            {amenityTranslations[category]?.ar || title}
                                        </span>
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                        {items.map(({ label, name: amenityName, icon }) => (
                                            <div key={amenityName} className="flex items-center group relative">
                                                <input
                                                    id={`amenities.${category}.${amenityName}`}
                                                    type="checkbox"
                                                    name={`amenities.${category}.${amenityName}`}
                                                    checked={formData.amenities[category][amenityName] || false} // Access the correct category
                                                    onChange={(e) => handleAmenityChange(category, amenityName, e.target.checked)} // Pass category and name
                                                    className="h-4 w-4 text-blue-600"
                                                />
                                                <label htmlFor={`amenities.${category}.${amenityName}`}
                                                    className="ml-2 cursor-pointer hover:scale-105 transition-transform flex items-center">
                                                    <FontAwesomeIcon icon={icon} className="mr-1" />
                                                    <span className="mr-1">{label}</span>
                                                    <span className="text-sm text-white z-50 hidden group-hover:block absolute -top-10 right-0 bg-blue-500 shadow-lg p-2 rounded z-[100]" dir="rtl" lang="ar">
                                                        {amenityTranslations[amenityName]?.ar}
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center mb-4">
                            <h3 className="mt-4 text-orange-500 text-xl font-bold">Environment</h3>
                            <button
                                type="button"
                                onClick={toggleEnvironment}
                                className="btn btn-secondary ms-5 mt-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded"
                            >
                                {showEnvironment ? 'Hide Environment' : 'Show Environment'}
                            </button>
                        </div>

                        {showEnvironment && (
                            <div id="Environment" className="bg-gray-100 p-4 rounded-lg shadow-md">
                                {environmentSections.map((section, sectionIndex) => (
                                    <div key={sectionIndex} className="mb-4">
                                        <h5 className="font-bold text-yellow-500 text-lg">{section.title}</h5>
                                        <ul className="list-group">
                                            {section.items.map((item, itemIndex) => (
                                                <li className="list-group-item flex items-center justify-between bg-white p-2 rounded shadow mb-2" key={itemIndex}>
                                                    <input
                                                        type="text"
                                                        className="form-control me-2 border border-gray-300 rounded p-2"
                                                        placeholder="Title"
                                                        value={item.title}
                                                        onChange={(e) => handleEnvironmentChange(sectionIndex, itemIndex, 'title', e.target.value)}
                                                    />
                                                    <input
                                                        type="number"
                                                        className="form-control me-2 border border-gray-300 rounded p-2"
                                                        placeholder="Distance (km)"
                                                        min="0"
                                                        step="0.1"
                                                        value={item.distance}
                                                        onChange={(e) => handleEnvironmentChange(sectionIndex, itemIndex, 'distance', e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded"
                                                        onClick={() => removeEnvironmentItem(sectionIndex, itemIndex)}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            type="button"
                                            className="btn btn-secondary mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                                            onClick={() => addEnvironmentItem(sectionIndex)}
                                        >
                                            Add Item
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Create Property
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Reset Form
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default NewHotel;
