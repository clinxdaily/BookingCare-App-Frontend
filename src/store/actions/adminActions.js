import actionTypes from "./actionTypes";
import {
  getAllCodeService,
  createNewUserService,
  getAllUsers,
  editUserService,
  deleteUserService,
  getTopDoctorHomeService,
  getAllDoctor,
  saveDetailDoctorService,
  getAllSpecialties,
} from "../../services/userService";
import { toast } from "react-toastify";
// export const fetchGenderStart = () => ({
//   type: actionTypes.FETCH_GENDER_START,
// });
export const fetchGenderStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.FETCH_GENDER_START });
      let res = await getAllCodeService("GENDER");
      if (res && res.errCode === 0) {
        dispatch(fetchGenderSuccess(res.data));
      }
    } catch (error) {
      dispatch(fetchGenderFailed());
      console.error("Error in fetchGenderStart:", error);
    }
  };
};
export const fetchGenderSuccess = (genderData) => ({
  type: actionTypes.FETCH_GENDER_SUCCESS,
  data: genderData,
});
export const fetchGenderFailed = () => ({
  type: actionTypes.FETCH_GENDER_FAILED,
});
export const fetchPositionStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.FETCH_POSITION_START });
      let res = await getAllCodeService("POSITION");
      if (res && res.errCode === 0) {
        dispatch(fetchPositionSuccess(res.data));
      }
    } catch (error) {
      dispatch(fetchPositionFailed());
      console.error("Error in fetchPositionStart:", error);
    }
  };
};
export const fetchPositionSuccess = (positionData) => ({
  type: actionTypes.FETCH_POSITION_SUCCESS,
  data: positionData,
});
export const fetchPositionFailed = () => ({
  type: actionTypes.FETCH_POSITION_FAILED,
});
export const fetchRoleStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.FETCH_ROLE_START });
      let res = await getAllCodeService("ROLE");
      if (res && res.errCode === 0) {
        dispatch(fetchRoleSuccess(res.data));
      }
    } catch (error) {
      dispatch(fetchRoleFailed());
      console.error("Error in fetchPositionStart:", error);
    }
  };
};
export const fetchRoleSuccess = (rolerData) => ({
  type: actionTypes.FETCH_ROLE_SUCCESS,
  data: rolerData,
});
export const fetchRoleFailed = () => ({
  type: actionTypes.FETCH_ROLE_FAILED,
});
export const createNewUser = (data) => {
  return async (dispatch, getState) => {
    try {
      console.log("Creating new user with data:", data);
      let res = await createNewUserService(data);
      if (res && res.errCode === 0) {
        toast.success("Create a new user succeed!");
        dispatch(saveUserSuccess());
        dispatch(fetchAllUserStart()); // Fetch all users after successful creation
      }
    } catch (error) {
      dispatch(saveUserFailed());
    }
  };
};
export const saveUserSuccess = () => ({
  type: actionTypes.CREATE_USER_SUCCESS,
});
export const saveUserFailed = () => ({
  type: actionTypes.CREATE_USER_FAILED,
});
export const fetchAllUserStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.FETCH_ROLE_START });
      let res = await getAllUsers("ALL");
      if (res && res.errCode === 0) {
        dispatch(fetchAllUsersSuccess(res.users.reverse()));
      }
    } catch (error) {
      dispatch(fetchAllUsersFailed());
    }
  };
};
export const fetchAllUsersSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_USERS_SUCCESS,
  users: data,
});
export const fetchAllUsersFailed = () => ({
  type: actionTypes.FETCH_ALL_USERS_FAILED,
});
export const deleteUser = (userId) => {
  return async (dispatch, getState) => {
    try {
      let res = await deleteUserService(userId);
      if (res && res.errCode === 0) {
        toast.success("Delete the user succeed!");
        dispatch(deleteUserSuccess());
        dispatch(fetchAllUserStart()); // Fetch all users after successful deletion
      } else {
        toast.error("Delete the user failed!");
      }
    } catch (error) {
      dispatch(deleteUserFailed());
    }
  };
};
export const deleteUserSuccess = () => ({
  type: actionTypes.DELETE_USER_SUCCESS,
});
export const deleteUserFailed = () => ({
  type: actionTypes.DELETE_USER_FAILED,
});
export const editUser = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await editUserService(data);
      if (res && res.errCode === 0) {
        toast.success("Update the user succeed!");
        dispatch(editUserSuccess());
        dispatch(fetchAllUserStart()); // Fetch all users after successful update
      } else {
        toast.error("Update the user failed!");
      }
    } catch (error) {
      dispatch(editUserFailed());
    }
  };
};
export const editUserSuccess = () => ({
  type: actionTypes.EDIT_USER_SUCCESS,
});
export const editUserFailed = () => ({
  type: actionTypes.EDIT_USER_FAILED,
});

export const fetchTopDoctor = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getTopDoctorHomeService("10");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
          data: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTOR_FAILED,
        });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.FETCH_TOP_DOCTOR_FAILED,
      });
    }
  };
};
export const fetchAllDoctor = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllDoctor();
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
          data: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_ALL_DOCTOR_FAILED,
        });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.FETCH_ALL_DOCTOR_FAILED,
      });
    }
  };
};
export const saveDetailDoctor = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await saveDetailDoctorService(data);
      if (res && res.errCode === 0) {
        toast.success("Save detail doctor succeed!");

        dispatch({
          type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
          data: res.data,
        });
      } else {
        toast.error("Save detail doctor failed!");
        dispatch({
          type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
        });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
      });
    }
  };
};
export const fetchAllScheduleTime = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("TIME");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_SCHEDULE_HOUR_SUCCESS,
          data: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_SCHEDULE_HOUR_FAILED,
        });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.FETCH_ALL_DOCTOR_FAILED,
      });
    }
  };
};

export const getRequireDoctorInfo = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.FETCH_REQUIRE_DOCTOR_INFO_START });
      let resPrice = await getAllCodeService("PRICE");
      let resPayment = await getAllCodeService("PAYMENT");
      let resProvince = await getAllCodeService("PROVINCE");
      let resSpecialty = await getAllSpecialties();
      if (
        resPrice &&
        resPrice.errCode === 0 &&
        resPayment &&
        resPayment.errCode === 0 &&
        resProvince &&
        resProvince.errCode === 0 &&
        resSpecialty &&
        resSpecialty.errCode === 0
      ) {
        let data = {
          resPrice: resPrice.data,
          resPayment: resPayment.data,
          resProvince: resProvince.data,
          resSpecialty: resSpecialty.data,
        };
        dispatch(fetchRequireDoctorInfoSuccess(data));
      }
    } catch (error) {
      dispatch(fetchRequireDoctorInfoFailed());
      console.error("Error in fetchGenderStart:", error);
    }
  };
};
export const fetchRequireDoctorInfoSuccess = (allRequireData) => ({
  type: actionTypes.FETCH_REQUIRE_DOCTOR_INFO_SUCCESS,
  data: allRequireData,
});
export const fetchRequireDoctorInfoFailed = () => ({
  type: actionTypes.FETCH_REQUIRE_DOCTOR_INFO_FAILED,
});
