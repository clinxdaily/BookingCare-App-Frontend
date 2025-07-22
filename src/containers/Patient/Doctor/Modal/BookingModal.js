import React, { Component } from "react";
import { connect } from "react-redux";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import Select from "react-select";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import { postPatientAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
      doctorId: "",
      genders: [],
      timeType: "",
      isBooking: false,
    };
  }

  async componentDidMount() {
    this.props.getGender();
  }

  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      data.forEach((item) => {
        result.push({
          label: language === LANGUAGES.VI ? item.valueVi : item.valueEn,
          value: item.keyMap,
        });
      });
    }
    return result;
  };

  async componentDidUpdate(prevProps) {
    // reload gender options khi đổi ngôn ngữ hoặc load lần đầu
    if (
      this.props.genderRedux !== prevProps.genderRedux ||
      this.props.language !== prevProps.language
    ) {
      this.setState({
        genders: this.buildDataGender(this.props.genderRedux),
      });
    }

    // khi dataTime đổi (user chọn slot khác)
    if (this.props.dataTime !== prevProps.dataTime) {
      if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
        this.setState({
          doctorId: this.props.dataTime.doctorId,
          timeType: this.props.dataTime.timeType,
        });
      }
    }
  }

  handleOnchangInput = (event, id) => {
    this.setState({ [id]: event.target.value });
  };

  handleOnChangeDatePicker = (date) => {
    this.setState({ birthday: date[0] });
  };

  handleChangeSelect = (selectedOption) => {
    this.setState({ selectedGender: selectedOption });
  };

  // ----- Helpers -----
  buildTimeBooking = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment
              .unix(+dataTime.date / 1000)
              .locale("en")
              .format("ddd - MM/DD/YYYY");
      return `${time} - ${date}`;
    }
    return "";
  };

  buildDoctorName = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let nameVi = `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`;
      let nameEn = `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
      return language === LANGUAGES.VI ? nameVi : nameEn;
    }
    return "";
  };

  // ----- Validate trước khi submit -----
  validateForm = () => {
    const {
      fullName,
      phoneNumber,
      email,
      address,
      reason,
      birthday,
      selectedGender,
    } = this.state;

    if (!fullName.trim()) return "Vui lòng nhập họ tên.";
    if (!phoneNumber.trim()) return "Vui lòng nhập số điện thoại.";
    if (!email.trim()) return "Vui lòng nhập email.";
    if (!address.trim()) return "Vui lòng nhập địa chỉ.";
    if (!reason.trim()) return "Vui lòng nhập lý do/triệu chứng.";
    if (!birthday) return "Vui lòng chọn ngày sinh.";
    if (!selectedGender || !selectedGender.value)
      return "Vui lòng chọn giới tính.";
    return null;
  };

  // ----- Submit booking -----
  handleConfirmBooking = async () => {
    const errorMsg = this.validateForm();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    const { dataTime, language } = this.props;
    const {
      fullName,
      phoneNumber,
      email,
      address,
      reason,
      birthday,
      selectedGender,
      doctorId,
      timeType,
    } = this.state;

    if (!dataTime || _.isEmpty(dataTime)) {
      toast.error("Không có thông tin lịch khám.");
      return;
    }

    const date = new Date(birthday).getTime();
    const timeString = this.buildTimeBooking(dataTime);
    const doctorName = this.buildDoctorName(dataTime);

    this.setState({ isBooking: true });
    try {
      let res = await postPatientAppointment({
        fullName,
        phoneNumber,
        email,
        address,
        reason,
        date: dataTime.date,
        birthday: date,
        selectedGender: selectedGender.value,
        doctorId,
        timeType,
        language,
        timeString,
        doctorName,
      });

      if (res && res.errCode === 0) {
        toast.success("Đặt lịch thành công! Vui lòng kiểm tra email.");
        // reset form
        this.setState({
          fullName: "",
          phoneNumber: "",
          email: "",
          address: "",
          reason: "",
          birthday: "",
          selectedGender: "",
          doctorId: "",
          timeType: "",
        });
        this.props.closeBookingModal();
      } else {
        toast.error("Đặt lịch thất bại!");
      }
    } catch (e) {
      console.error("Booking error:", e);
      toast.error("Lỗi máy chủ, vui lòng thử lại.");
    } finally {
      this.setState({ isBooking: false });
    }
  };

  render() {
    let { isOpenModal, closeBookingModal, dataTime } = this.props;
    let { doctorId, isBooking } = this.state;

    return (
      <React.Fragment>
        <Modal
          isOpen={isOpenModal}
          className={"booking-modal-container"}
          size="xl"
          centered
        >
          <LoadingOverlay
            active={isBooking}
            spinner
            text="Đang gửi yêu cầu đặt lịch..."
          >
            <div className="booking-modal-content">
              <div className="booking-modal-header">
                <span className="left">Thông tin đặt lịch khám bệnh</span>
                <span
                  className={`right ${isBooking ? "disabled" : ""}`}
                  onClick={!isBooking ? closeBookingModal : undefined}
                >
                  <i className="fas fa-times"></i>
                </span>
              </div>

              <div className="booking-modal-body">
                <div className="doctor-info">
                  <ProfileDoctor
                    doctorId={doctorId}
                    isShowIntro={false}
                    dataTime={dataTime}
                    isShowLinkDetail={false}
                    isShowPrice={true}
                  />
                </div>

                <div className="row ">
                  <div className="col-6 form-group">
                    <label>Họ tên người đặt</label>
                    <input
                      disabled={isBooking}
                      className="form-control"
                      value={this.state.fullName}
                      onChange={(e) => this.handleOnchangInput(e, "fullName")}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>Số điện thoại người đặt</label>
                    <input
                      disabled={isBooking}
                      className="form-control"
                      value={this.state.phoneNumber}
                      onChange={(e) =>
                        this.handleOnchangInput(e, "phoneNumber")
                      }
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>Email người đặt</label>
                    <input
                      disabled={isBooking}
                      className="form-control"
                      value={this.state.email}
                      onChange={(e) => this.handleOnchangInput(e, "email")}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>Địa chỉ người đặt</label>
                    <input
                      disabled={isBooking}
                      className="form-control"
                      value={this.state.address}
                      onChange={(e) => this.handleOnchangInput(e, "address")}
                    />
                  </div>
                  <div className="col-12 form-group">
                    <label>Lý do/Triệu chứng đặt khám</label>
                    <input
                      disabled={isBooking}
                      className="form-control"
                      value={this.state.reason}
                      onChange={(e) => this.handleOnchangInput(e, "reason")}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>Ngày sinh</label>
                    <DatePicker
                      disabled={isBooking}
                      onChange={this.handleOnChangeDatePicker}
                      className="form-control"
                      value={this.state.birthday}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>Giới tính người đặt</label>
                    <Select
                      isDisabled={isBooking}
                      value={this.state.selectedGender}
                      onChange={this.handleChangeSelect}
                      options={this.state.genders}
                    />
                  </div>
                </div>
              </div>

              <div className="booking-modal-footer">
                <button
                  className="btn-booking-confirm"
                  disabled={isBooking}
                  onClick={this.handleConfirmBooking}
                >
                  {isBooking ? "Đang gửi..." : "Xác nhận"}
                </button>
                <button
                  className="btn-booking-cancel"
                  disabled={isBooking}
                  onClick={closeBookingModal}
                >
                  Hủy
                </button>
              </div>
            </div>
          </LoadingOverlay>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
  genderRedux: state.admin.genders,
});

const mapDispatchToProps = (dispatch) => ({
  getGender: () => dispatch(actions.fetchGenderStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
