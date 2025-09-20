import axios from "../axios";

const handleLoginApi = (email, password) => {
  return axios.post("/api/login", {
    email: email,
    password: password,
  });
};
const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`);
};
const createNewUserService = (data) => {
  return axios.post("/api/create-new-user", data);
};
const deleteUserService = (userId) => {
  return axios.delete("/api/delete-user", {
    data: {
      id: userId,
    },
  });
};
const editUserService = (inputData) => {
  return axios.put("/api/edit-user", inputData);
};
const getAllCodeService = (inputType) => {
  return axios.get(`/api/allcode?type=${inputType}`);
};
const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
};
const getAllDoctor = () => {
  return axios.get(`/api/get-all-doctor`);
};
const saveDetailDoctorService = (data) => {
  return axios.post("/api/save-info-doctor", data);
};
const getDetailInFoDoctor = (id) => {
  return axios.get(`/api/get-detail-doctor_byid?id=${id}`);
};
const saveBulkScheduleDoctor = (data) => {
  return axios.post("/api/bulk_create_schedule", data);
};
const getScheduleDoctorByDate = (doctorId, date) => {
  return axios.get(
    `/api/get-schedule-doctor_by_date?doctorId=${doctorId}&date=${date}`
  );
};
export const deleteScheduleByDoctor = (doctorId, date, timeType) => {
  return axios.post("/api/delete-schedule-doctor_by_id", {
    doctorId,
    date,
    timeType,
  });
};

const getExtraInfoDoctorById = (doctorId) => {
  return axios.get(`/api/get-extra-info-doctor_by_id?doctorId=${doctorId}`);
};
const getProfileDoctorById = (doctorId) => {
  return axios.get(`/api/get-profile-doctor_by_id?doctorId=${doctorId}`);
};
const postPatientAppointment = (data) => {
  return axios.post("/api/patient-book-appointment", data);
};
const postVerifyBookAppointment = (data) => {
  return axios.post("/api/verify-book-appointment", data);
};
const createNewSpecialty = (data) => {
  return axios.post("/api/create-new-specialty", data);
};
const getRevenue = (doctorId, date, filterType) => {
  return axios.get("/api/get-revenue", {
    params: {
      doctorId,
      date,
      filterType,
    },
  });
};

const editSpecialty = (data) => {
  return axios.post("/api/edit-specialty", data);
};
export const deleteSpecialty = (id) => {
  return axios.delete("/api/delete-specialty", {
    params: { id },
  });
};
const getHistoryAppointment = (doctorId) => {
  return axios.get(`/api/get-history-appointment`, {
    params: {
      doctorId: doctorId,
    },
  });
};

const getAllSpecialties = () => {
  return axios.get("/api/get-all-specialty");
};

const getDetailSpecialtiesById = (data) => {
  return axios.get(
    `/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`
  );
};
//
const createNewHandbook = (data) => {
  return axios.post("/api/create-new-handbook", data);
};
const getAllHandbooks = () => {
  return axios.get("/api/get-all-handbook");
};
const editHandbook = (data) => {
  return axios.post("/api/edit-handbook", data);
};
export const deleteHandbook = (id) => {
  return axios.delete("/api/delete-handbook", {
    params: { id },
  });
};

const getDetailHandbookById = (data) => {
  return axios.get(`/api/get-detail-handbook-by-id?id=${data.id}`);
};

//
const getAllPatientForDoctor = (data) => {
  return axios.get(
    `/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`
  );
};

const postSendRemedy = (data) => {
  return axios.post("/api/send-remedy", data);
};
const getRemedyByBooking = (data) => {
  return axios.post("/api/get-remedy-by-booking", data);
};

const cancelAppointment = (data) => {
  return axios.post("/api/cancel-appointment", data);
};
const deleteHistoryAppointment = (data) => {
  return axios.post("/api/delete-history-appointment", data);
};
export {
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getTopDoctorHomeService,
  getAllDoctor,
  saveDetailDoctorService,
  getDetailInFoDoctor,
  saveBulkScheduleDoctor,
  getScheduleDoctorByDate,
  getExtraInfoDoctorById,
  getProfileDoctorById,
  postPatientAppointment,
  postVerifyBookAppointment,
  createNewSpecialty,
  getAllSpecialties,
  getDetailSpecialtiesById,
  getAllPatientForDoctor,
  postSendRemedy,
  editSpecialty,
  createNewHandbook,
  getAllHandbooks,
  editHandbook,
  getDetailHandbookById,
  cancelAppointment,
  getHistoryAppointment,
  deleteHistoryAppointment,
  getRevenue,
  getRemedyByBooking,
};
