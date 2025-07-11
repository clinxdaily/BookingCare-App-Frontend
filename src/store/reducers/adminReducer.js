import actionTypes from "../actions/actionTypes";

const initialState = {
  isLoadingGender: false,
  genders: [],
  roles: [],
  positions: [],
  users: [],
  topDoctors: [],
  allDoctors: [],
  allScheduleTime: [],
  allRequireDoctorInfo: [],
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    // -------- GENDER --------
    case actionTypes.FETCH_GENDER_START:
      return {
        ...state,
        isLoadingGender: true,
      };

    case actionTypes.FETCH_GENDER_SUCCESS:
      return {
        ...state,
        genders: action.data,
        isLoadingGender: false,
      };

    case actionTypes.FETCH_GENDER_FAILED:
      return {
        ...state,
        genders: [],
        isLoadingGender: false,
      };

    // -------- POSITION --------
    case actionTypes.FETCH_POSITION_START:
      return { ...state }; // có thể đặt isLoadingPosition nếu cần

    case actionTypes.FETCH_POSITION_SUCCESS:
      return {
        ...state,
        positions: action.data, // nhận dữ liệu từ API
      };

    case actionTypes.FETCH_POSITION_FAILED:
      return {
        ...state,
        positions: [],
      };

    // -------- ROLE --------
    case actionTypes.FETCH_ROLE_START:
      return { ...state };

    case actionTypes.FETCH_ROLE_SUCCESS:
      return {
        ...state,
        roles: action.data, // nhận dữ liệu từ API
      };

    case actionTypes.FETCH_ROLE_FAILED:
      return {
        ...state,
        roles: [],
      };
    // -------- USER --------
    case actionTypes.FETCH_ALL_USERS_SUCCESS:
      state.users = action.users; // nhận dữ liệu từ API
      return { ...state };
    case actionTypes.FETCH_ALL_USERS_FAILED:
      state.users = [];
      return {
        ...state,
      };
    // -------- TOP_DOCTOR --------
    case actionTypes.FETCH_TOP_DOCTOR_SUCCESS:
      state.topDoctors = action.data; // nhận dữ liệu từ API
      return { ...state };
    case actionTypes.FETCH_TOP_DOCTOR_FAILED:
      state.topDoctors = [];
      return {
        ...state,
      };
    // -------- ALL_DOCTOR --------
    case actionTypes.FETCH_ALL_DOCTOR_SUCCESS:
      state.allDoctors = action.data; // nhận dữ liệu từ API
      return { ...state };
    case actionTypes.FETCH_ALL_DOCTOR_FAILED:
      state.allDoctors = [];
      return {
        ...state,
      };
    // -------- TIME --------
    case actionTypes.FETCH_SCHEDULE_HOUR_SUCCESS:
      state.allScheduleTime = action.data; // nhận dữ liệu từ API
      return { ...state };
    case actionTypes.FETCH_SCHEDULE_HOUR_FAILED:
      state.allScheduleTime = [];
      return {
        ...state,
      };
    // -------- Doctor Info --------
    case actionTypes.FETCH_REQUIRE_DOCTOR_INFO_SUCCESS:
      state.allRequireDoctorInfo = action.data; // nhận dữ liệu từ API
      console.log("check require data ", action);
      return { ...state };
    case actionTypes.FETCH_REQUIRE_DOCTOR_INFO_FAILED:
      state.allRequireDoctorInfo = [];
      return {
        ...state,
      };

    // -------- DEFAULT --------
    default:
      return state;
  }
};

export default adminReducer;
