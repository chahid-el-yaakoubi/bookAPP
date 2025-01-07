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
        ar: "واي فاي مجاني في جميع أنحاء المنشأة"
    },
    parking: {
        en: "On-site parking available",
        ar: "موقف سيارات متاح في الموقع"
    },
    pool: {
        en: "Swimming pool access",
        ar: "دخول إلى المسبح"
    },
    restaurant: {
        en: "On-site restaurant",
        ar: "مطعم في الموقع"
    },
    gym: {
        en: "Fitness center",
        ar: "مركز لياقة بدنية"
    },
    spa: {
        en: "Spa and wellness center",
        ar: "مركز سبا وصحة"
    },
    airConditioning: {
        en: "Climate control in rooms",
        ar: "تحكم في المناخ في الغرف"
    },
    kitchen: {
        en: "Kitchen facilities",
        ar: "مرافق المطبخ"
    },
    tv: {
        en: "Television in rooms",
        ar: "تلفزيون في الغرف"
    },
    elevator: {
        en: "Elevator access",
        ar: "دخول إلى المصعد"
    },
    beachAccess: {
        en: "Direct beach access",
        ar: "دخول مباشر إلى الشاطئ"
    },
    garden: {
        en: "Garden area",
        ar: "منطقة حديقة"
    },
    gameRoom: {
        en: "Game room facilities",
        ar: "مرافق غرفة الألعاب"
    },
    businessCenter: {
        en: "Business center services",
        ar: "خدمات مركز الأعمال"
    },
    laundry: {
        en: "Laundry services",
        ar: "خدمات غسيل الملابس"
    },
    roomService: {
        en: "24/7 room service",
        ar: "خدمة الغرف على مدار الساعة"
    },
    bar: {
        en: "On-site bar",
        ar: "بار في الموقع"
    },
    terrace: {
        en: "Terrace area",
        ar: "منطقة التراس"
    },
    familyRooms: {
        en: "Family-friendly rooms",
        ar: "غرف مناسبة للعائلات"
    },
    sauna: {
        en: "Sauna facilities",
        ar: "مرافق الساونا"
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
        ar: "أريكة"
    },
    desk: {
        en: "Desk",
        ar: "مكتب"
    },
    wardrobe: {
        en: "Wardrobe",
        ar: "خزانة ملابس"
    },
    alarmClock: {
        en: "Alarm Clock",
        ar: "ساعة منبه"
    },
    socketNearBed: {
        en: "Socket Near Bed",
        ar: "مقبس بالقرب من السرير"
    },
    sofaBed: {
        en: "Sofa Bed",
        ar: "أريكة قابلة للتحويل"
    },
    clothesRack: {
        en: "Clothes Rack",
        ar: "حامل ملابس"
    },
    dryingRack: {
        en: "Drying Rack",
        ar: "حامل تجفيف"
    },
    tileMarbleFloor: {
        en: "Tile Marble Floor",
        ar: "أرضية رخامية"
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
        ar: "مكواة"
    },
    extraLongBeds: {
        en: "Extra Long Beds",
        ar: "أسرة طويلة إضافية"
    },
    linens: {
        en: "Linens",
        ar: "أغطية السرير"
    },
    shower: {
        en: "Shower",
        ar: "دش"
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
        ar: "مجفف شعر"
    },
    privateParking: {
        en: "Private Parking",
        ar: "موقف سيارات خاص"
    },
    parkingGarage: {
        en: "Parking Garage",
        ar: "مرآب سيارات"
    },
    coffeemaker: {
        en: "Coffee Maker",
        ar: "ماكينة قهوة"
    },
    oven: {
        en: "Oven",
        ar: "فرن"
    },
    microwave: {
        en: "Microwave",
        ar: "ميكروويف"
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
        ar: "محماص"
    },
    stovetop: {
        en: "Stovetop",
        ar: "موقد"
    },
    kitchenware: {
        en: "Kitchenware",
        ar: "أدوات المطبخ"
    },
    electricKettle: {
        en: "Electric Kettle",
        ar: "غلاية كهربائية"
    },
    dishwasher: {
        en: "Dishwasher",
        ar: "غسالة صحون"
    },
    picnicArea: {
        en: "Picnic Area",
        ar: "منطقة للنزهات"
    },
    beachfront: {
        en: "Beachfront",
        ar: "واجهة بحرية"
    },
    garden: {
        en: "Garden",
        ar: "حديقة"
    },
    outdoorPool: {
        en: "Outdoor Pool",
        ar: "مسبح خارجي"
    },
    poolView: {
        en: "Pool View",
        ar: "إطلالة على المسبح"
    },
    beachChairs: {
        en: "Beach Chairs",
        ar: "كراسي شاطئية"
    },
    outdoorFurniture: {
        en: "Outdoor Furniture",
        ar: "أثاث خارجي"
    },
    sunTerrace: {
        en: "Sun Terrace",
        ar: "تراس الشمس"
    },
    balcony: {
        en: "Balcony",
        ar: "شرفة"
    },
    patio: {
        en: "Patio",
        ar: "فناء"
    },
    beachAccess: {
        en: "Beach Access",
        ar: "دخول إلى الشاطئ"
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
        ar: "جولات بالدراجات"
    },
    walkingTours: {
        en: "Walking Tours",
        ar: "جولات مشي"
    },
    horseRiding: {
        en: "Horse Riding",
        ar: "ركوب الخيل"
    },
    cycling: {
        en: "Cycling",
        ar: "ركوب الدراجات"
    },
    hiking: {
        en: "Hiking",
        ar: "المشي في الجبال"
    },
    windsurfing: {
        en: "Windsurfing",
        ar: "ركوب الأمواج"
    },
    tennis: {
        en: "Tennis",
        ar: "تنس"
    },
    billiards: {
        en: "Billiards",
        ar: "بلياردو"
    },
    conciergeService: {
        en: "Concierge Service",
        ar: "خدمة الاستقبال"
    },
    currencyExchange: {
        en: "Currency Exchange",
        ar: "تبادل العملات"
    },
    frontDesk24h: {
        en: "Front Desk 24h",
        ar: "خدمة الاستقبال على مدار 24 ساعة"
    },
    ironingService: {
        en: "Ironing Service",
        ar: "خدمة الكي"
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
        ar: "غسيل"
    },
    airportShuttle: {
        en: "Airport Shuttle",
        ar: "خدمة النقل من وإلى المطار"
    },
    invoiceProvided: {
        en: "Invoice Provided",
        ar: "تقديم الفاتورة"
    },
    expressCheckInOut: {
        en: "Express Check-in/Out",
        ar: "تسجيل دخول/خروج سريع"
    },
    elevator: {
        en: "Elevator",
        ar: "مصعد"
    },
    minimarket: {
        en: "Mini Market",
        ar: "سوق صغير"
    },
    beautyShop: {
        en: "Beauty Shop",
        ar: "محل تجميل"
    },
    smokingArea: {
        en: "Smoking Area",
        ar: "منطقة التدخين"
    },
    soundproofRooms: {
        en: "Soundproof Rooms",
        ar: "غرف عازلة للصوت"
    },
    meetingFacilities: {
        en: "Meeting Facilities",
        ar: "مرافق الاجتماعات"
    },
    sharedLounge: {
        en: "Shared Lounge",
        ar: "صالة مشتركة"
    },
    fireExtinguishers: {
        en: "Fire Extinguishers",
        ar: "طفايات حريق"
    },
    security24h: {
        en: "Security 24h",
        ar: "الأمن على مدار 24 ساعة"
    },
    keyCardAccess: {
        en: "Key Card Access",
        ar: "دخول بواسطة بطاقة المفتاح"
    },
    cctvOutside: {
        en: "CCTV Outside",
        ar: "كاميرات المراقبة خارج المبنى"
    },
    cctvCommonAreas: {
        en: "CCTV Common Areas",
        ar: "كاميرات المراقبة في المناطق المشتركة"
    },
    securityAlarm: {
        en: "Security Alarm",
        ar: "إنذار أمني"
    },
    smokeFree: {
        en: "Smoke Free",
        ar: "منطقة خالية من التدخين"
    },
    spa: {
        en: "Spa",
        ar: "منتجع صحي"
    },
    steamRoom: {
        en: "Steam Room",
        ar: "غرفة بخار"
    },
    bodyTreatments: {
        en: "Body Treatments",
        ar: "علاجات الجسم"
    },
    beautyServices: {
        en: "Beauty Services",
        ar: "خدمات التجميل"
    },
    hammam: {
        en: "Hammam",
        ar: "حمام"
    }
};