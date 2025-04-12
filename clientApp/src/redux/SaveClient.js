// src/redux/save.js

// Action Types
const TOGGLE_RESERVATION = "save/TOGGLE_RESERVATION";
const CLEAR_RESERVATIONS = "save/CLEAR_RESERVATIONS";

// Load initial state from localStorage
const saved = localStorage.getItem("reservations");
const initialState = {
  reservations: saved ? JSON.parse(saved) : [],
};

// Reducer
const saveReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_RESERVATION: {
      const { hotelId, userId, date } = action.payload;
      const exists = state.reservations.find(
        (res) => res.hotelId === hotelId
      );

      let updated;
      if (exists) {
        updated = state.reservations.filter(
          (res) => res.hotelId !== hotelId
        );
      } else {
        updated = [...state.reservations, { hotelId, userId, date }];
      }

      localStorage.setItem("reservations", JSON.stringify(updated));
      return {
        ...state,
        reservations: updated,
      };
    }

    case CLEAR_RESERVATIONS:
      localStorage.removeItem("reservations");
      return { ...state, reservations: [] };

    default:
      return state;
  }
};

// Action Creators
export const toggleReservation = (hotelId, userId, date) => ({
  type: TOGGLE_RESERVATION,
  payload: { hotelId, userId, date },
});

export const clearReservations = () => ({
  type: CLEAR_RESERVATIONS,
});

export default saveReducer;
