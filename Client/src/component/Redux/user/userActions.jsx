import axios from "axios";
import {
  FETCH_USER_DETAILS,
  UPDATE_USER_DETAILS,
} from "../user/userTypes";

export const fetchUserDetails = (userId) => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:5174/api/profile/get/' + userId, {
      headers: {
        'userId': userId,
      },
    });

    dispatch({ type: 'FETCH_USER_DETAILS_SUCCESS', payload: response.data });
  } catch (error) {
    console.error('Error fetching user details:', error);
    dispatch({ type: 'FETCH_USER_DETAILS_FAILURE', error });
  }
};

export const updateUserDetails = (userId, userData) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_API}/api/profile/update/${userId}`,
      userData
    );
    if (response.data) {
      dispatch({ type: UPDATE_USER_DETAILS, payload: response.data.user });
    }
  } catch (error) {
    console.error("Error updating user details:", error.response || error);
  }
};
