const exampleHotelData ={
    "name": "Seaside Resort",
    "title": "Luxury Seaside Resort",
    "type": "resort",
    "location": {
      "city": "Miami",
      "address": "123 Ocean Drive",
      "latitude": 25.7617,
      "longitude": -80.1918,
      "distanceFromCityCenter": 5
    },
    "contact": {
      "phone": "+1-305-555-0123",
      "bookPhone": "+1-305-555-0124",
      "website": "https://www.seasideresort.com",
      "email": "info@seasideresort.com"
    },
    "description": "A luxurious resort with stunning ocean views and top-notch amenities.",
    "rating": 4.8,
    "basePrice": 250,
    "rental": {
      "durationType": "night",
      "customDays": null,
      "hasFurniture": null
    },
    "proximity": {
      "nearbyPlaces": [
        { "name": "Beach Park", "distance": "0.5 km" },
        { "name": "Shopping Mall", "distance": "2 km" }
      ],
      "restaurants": [
        { "name": "Ocean Grill", "type": "Seafood", "distance": "0.3 km" },
        { "name": "Italian Bistro", "type": "Italian", "distance": "1 km" }
      ],
      "publicTransit": [
        { "name": "City Bus", "type": "Bus", "distance": "0.2 km" }
      ],
      "beaches": [
        { "name": "Sunny Beach", "distance": "0.1 km" }
      ],
      "airports": [
        { "name": "Miami International Airport", "distance": "15 km" }
      ]
    },
    "amenities": {
      "wifi": true,
      "parking": true,
      "pool": true,
      "restaurant": true,
      "gym": true,
      "privateBathroom": true,
      "airConditioning": true,
      "kitchen": false,
      "flatScreenTV": true,
      "familyRooms": true,
      "washingMachine": false,
      "sofa": true,
      "desk": true,
      "wardrobe": true,
      "alarmClock": true,
      "socketNearBed": true,
      "sofaBed": false,
      "clothesRack": true,
      "dryingRack": false,
      "tileMarbleFloor": true,
      "privateEntrance": false,
      "fan": false,
      "iron": true,
      "extraLongBeds": false,
      "linens": true,
      "shower": true,
      "bath": false,
      "bidet": false,
      "hairdryer": true,
      "privateParking": true,
      "parkingGarage": false,
      "coffeemaker": true,
      "oven": false,
      "microwave": true,
      "refrigerator": true,
      "highChair": false,
      "diningTable": true,
      "toaster": true,
      "stovetop": false,
      "kitchenware": true,
      "electricKettle": true,
      "dishwasher": false,
      "picnicArea": false,
      "beachfront": true,
      "garden": true,
      "outdoorPool": true,
      "poolView": true,
      "beachChairs": true,
      "outdoorFurniture": true,
      "sunTerrace": true,
      "balcony": true,
      "patio": false,
      "beachAccess": true,
      "gamesRoom": false,
      "liveMusic": false,
      "bikeTours": false,
      "walkingTours": false,
      "horseRiding": false,
      "cycling": false,
      "hiking": false,
      "windsurfing": false,
      "tennis": false,
      "billiards": false,
      "conciergeService": true,
      "currencyExchange": true,
      "frontDesk24h": true,
      "ironingService": true,
      "housekeeping": true,
      "drycleaning": false,
      "laundry": true,
      "airportShuttle": true,
      "invoiceProvided": true,
      "expressCheckInOut": true,
      "elevator": true,
      "minimarket": false,
      "beautyShop": false,
      "smokingArea": false,
      "soundproofRooms": false,
      "meetingFacilities": true,
      "sharedLounge": false,
      "fireExtinguishers": true,
      "security24h": true,
      "keyCardAccess": true,
      "cctvOutside": true,
      "cctvCommonAreas": true,
      "securityAlarm": true,
      "smokeFree": true,
      "spa": true,
      "steamRoom": false,
      "bodyTreatments": true,
      "beautyServices": true,
      "hammam": false
    },
    "policies": {
      "pets": {
        "allowed": false
      },
      "smoking": {
        "allowed": false
      },
      "events": {
        "allowed": true
      },
      "quietHours": {
        "enforced": true,
        "from": "10:00 PM",
        "to": "7:00 AM"
      },
      "checkIn": {
        "from": "3:00 PM",
        "to": "11:00 PM"
      },
      "checkOut": {
        "from": "11:00 AM",
        "to": "12:00 PM"
      }
    },
    "languages": [
      "English",
      "Spanish",
      "French"
    ],
    "photos": [
      "https://www.seasideresort.com/images/photo1.jpg",
      "https://www.seasideresort.com/images/photo2.jpg"
    ],
    "rooms": [
      "id_room_1",
      "id_room_2",
      "id_room_3"
    ],
    "status": "available",
    "featured": true
  }


//   room exmeple
const exampleRoomData = {
    title: "Deluxe Suite",
    price: 150,
    maxPeople: 4,
    desc: "A spacious suite with a beautiful view and modern amenities.",
    area: 45,
    roomNumber: [
        {
            number: 101,
            unavailableDates: [new Date('2023-10-01'), new Date('2023-10-05')]
        },
        {
            number: 102,
            unavailableDates: []
        }
    ],
    amenities: ["WiFi", "Air Conditioning", "TV", "Mini Bar"]
};