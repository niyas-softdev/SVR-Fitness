import { FETCH_USER_DETAILS, UPDATE_USER_DETAILS } from "../user/userTypes";

const initialState = {
  userDetails: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_DETAILS:
      return { ...state, userDetails: action.payload };
    case UPDATE_USER_DETAILS:
      return { ...state, userDetails: action.payload };
    default:
      return state;
  }
};

export default userReducer;
