import { 
    faWifi, faParking, faSwimmingPool, faUtensils, faDumbbell,
    faBath, faSnowflake, faKitchenSet, faTv, faPeopleRoof,
    faCouch, faDesktop, faSpa, faClock, faPlug, faSquare, 
    faDoorOpen, faBed, faShower, faToilet, faTable, faParking as faParkingAlt,
    faUmbrella, faUmbrellaBeach, faTree, faChair, faGamepad, faMusic,
    faBicycle, faPersonWalking, faHorse, faPersonHiking, faWind, 
    faTableTennis, faConciergeBell, faMoneyBillTransfer, faBroom,
    faCarSide, faFileInvoice, faDoorOpen as faDoorOpenAlt, faElevator,
    faStore, faSmoking, faShieldHalved, faPeopleRoof as faPeopleRoofAlt,
    faFireExtinguisher, faKey, faCamera, faBell, faSmokingBan
} from "@fortawesome/free-solid-svg-icons";

    // Add amenity categories configuration
    export const amenityCategories = {
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
                { label: "Drying Rack", name: "dryingRack", icon: faClock },
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
    export const amenityTranslations = {
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

