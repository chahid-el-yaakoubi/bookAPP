import React from 'react'
import RoomList from './RoomList'

export const roomData = {
    _id: { $oid: "6807e28331cf9695718c6d28" },
    type: "Deluxe Room",
    description:
      "Luxurious room with traditional Moroccan decor, featuring modern amenities and stunning views. Perfect for a relaxing getaway with access to our premium services and facilities.",
    price: { $numberInt: "5000" },
    amenities: [],
    roomFeatures: [
      "air_conditioning",
      "fan",
      "full_length_mirror",
      "blackout_curtains",
      "wardrobe",
      "heating_system",
      "reading_lights",
      "balcony",
      "soundproofing",
      "terrace",
      "safe",
      "iron",
      "telephone",
      "luggage_rack",
      "alarm_clock",
      "moroccan_decor",
      "courtyard_access",
      "traditional_rugs",
    ],
    view: ["Medina View", "Garden View", "Ocean View"],
    beds: [
      {
        type: "Double Bed",
        count: { $numberInt: "1" },
        _id: {
          $oid: "6807e24bc46b6b03ec165069",
        },
      },
    ],
    floor: null,
    roomTitle: ["155,454,565"],
    capacity: { $numberInt: "2" },
    bathrooms: [
      {
        id: { $numberInt: "1" },
        amenities: {
          moroccan_hamam_basin: true,
          ghassoul: true,
          jacuzzi: true,
          water_bucket: true,
          kessa_glove: true,
          toilet_bidet: true,
          toilet_paper: true,
          towels_bathrobes: true,
          heated_towel_rack: true,
          vanity_light: true,
          shower_cap: true,
          air_freshener: true,
          slippers: true,
          trash_bin: true,
          shower_bathtub: true,
          moroccan_black_soap: true,
          essential_oils: true,
          sink_with_mirror: true,
          power_socket: true,
          bath_mat: true,
          hairdryer: true,
          rain_shower: true,
        },
        type: "Shower Only",
        _id: {
          $oid: "6807e24bc46b6b03ec16506a",
        },
      },
      {
        id: { $numberInt: "2" },
        amenities: {
          moroccan_hamam_basin: true,
          ghassoul: true,
          kessa_glove: true,
          water_bucket: true,
          moroccan_black_soap: true,
          essential_oils: true,
          sink_with_mirror: true,
          power_socket: true,
          bath_mat: true,
          trash_bin: true,
          shower_bathtub: true,
          toilet_bidet: true,
          toilet_paper: true,
          heated_towel_rack: true,
          towels_bathrobes: true,
          slippers: true,
          air_freshener: true,
          hairdryer: true,
          rain_shower: true,
          vanity_light: true,
          shower_cap: true,
          jacuzzi: true,
          makeup_mirror: true,
        },
        type: "Shared Bathroom",
        _id: {
          $oid: "6807e24bc46b6b03ec16506b",
        },
      },
    ],
    size: {
      value: { $numberInt: "35" },
      unit: "sq_m",
    },
    categorizedAmenities: {
      Entertainment: ["tv", "books", "speakers", "streaming_services"],
      Workspace: ["desk", "high_speed_wifi", "power_outlets"],
      "Moroccan Features": [
        "traditional_breakfast",
        "mint_tea_service",
        "hammam_access",
        "local_artwork",
        "courtyard_seating",
        "moroccan_toiletries",
      ],
      "Kitchen & Dining": ["mini_fridge", "dining_area", "coffee_maker_kettle", "bottled_water"],
      Technology: ["bluetooth_speaker", "smart_home", "usb_charging", "international_outlets"],
    },
    photos: [],
    createdAt: {
      $date: { $numberLong: "1745347147769" },
    },
    updatedAt: {
      $date: { $numberLong: "1745347147769" },
    },
    __v: { $numberInt: "0" },
  }

  

export const LayoutRoom = ({rooms}) => {
  const roomms = rooms;

  return (
    <RoomList rooms={roomms} />
  )
}
