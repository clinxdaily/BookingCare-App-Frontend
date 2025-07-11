import React, { Component } from "react";
import { connect } from "react-redux";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import { FormattedMessage } from "react-intl";
import { classNames } from "react-select/dist/index-ea9e225d.cjs.prod";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import Select from "react-select";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import { postPatientAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: " ",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
      doctorId: "",
      genders: "",
      timeType: "",
    };
  }
  async componentDidMount() {
    this.props.getGender();
  }
  builDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        genders: this.builDataGender(this.props.genderRedux),
      });
    }
    if (this.props.genderRedux !== prevProps.genderRedux) {
      this.setState({
        genders: this.builDataGender(this.props.genderRedux),
      });
    }
    if (this.props.dataTime !== prevProps.dataTime) {
      if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
        let doctorId = this.props.dataTime.doctorId;
        let timeType = this.props.dataTime.timeType;
        this.setState({ doctorId: doctorId, timeType: timeType });
      }
    }
  }

  handleOnchangInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };
  handleOnChangeDatePicker = (date) => {
    this.setState({
      birthday: date[0],
    });
  };
  handleChangeSelect = (selectedOption) => {
    this.setState({
      selectedGender: selectedOption,
    });
  };
  handleConfirmBooking = async () => {
    let date = new Date(this.state.birthday).getTime();
    let timeString = this.buildTimeBooking(this.props.dataTime);
    let doctorName = this.builDoctorName(this.props.dataTime);

    let res = await postPatientAppointment({
      fullName: this.state.fullName,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      address: this.state.address,
      reason: this.state.reason,
      date: this.props.dataTime.date,
      birthday: date,
      selectedGender: this.state.selectedGender.value,
      doctorId: this.state.doctorId,
      timeType: this.state.timeType,
      language: this.props.language,
      timeString: timeString,
      doctorName: doctorName,
    });
    if (res && res.errCode === 0) {
      toast.success("Booking a new appoiment succeed !");
      // Reset các trường về mặc định
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
      toast.error("Booking a new appoiment failed !");
    }
  };
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
    return <></>;
  };
  builDoctorName = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let nameVi = `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`;
      let nameEn = `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
      return language === LANGUAGES.VI ? nameVi : nameEn;
    }
    return "";
  };
  render() {
    let { isOpenModal, closeBookingModal, dataTime } = this.props;
    let doctorId = this.state.doctorId;

    return (
      <React.Fragment>
        <Modal
          isOpen={isOpenModal}
          className={"booking-modal-container"}
          size="xl"
          centered
          //   backdrop={true}
        >
          <div className="booking-modal-content">
            <div className="booking-modal-header">
              <span className="left">Thông tin đặt lịch khám bệnh</span>
              <span className="right" onClick={closeBookingModal}>
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
                    className="form-control"
                    value={this.state.fullName}
                    onChange={(event) =>
                      this.handleOnchangInput(event, "fullName")
                    }
                  ></input>
                </div>
                <div className="col-6 form-group">
                  <label>Số điện thoại người đặt</label>
                  <input
                    className="form-control"
                    value={this.state.phoneNumber}
                    onChange={(event) =>
                      this.handleOnchangInput(event, "phoneNumber")
                    }
                  ></input>
                </div>
                <div className="col-6 form-group">
                  <label>Email người đặt</label>
                  <input
                    className="form-control"
                    value={this.state.email}
                    onChange={(event) =>
                      this.handleOnchangInput(event, "email")
                    }
                  ></input>
                </div>
                <div className="col-6 form-group">
                  <label>Địa chỉ người đặt</label>
                  <input
                    className="form-control"
                    value={this.state.address}
                    onChange={(event) =>
                      this.handleOnchangInput(event, "address")
                    }
                  ></input>
                </div>
                <div className="col-12 form-group">
                  <label>Lý do/Triệu chứng đặt khám </label>
                  <input
                    className="form-control"
                    value={this.state.reason}
                    onChange={(event) =>
                      this.handleOnchangInput(event, "reason")
                    }
                  ></input>
                </div>
                <div className="col-6 form-group">
                  <label>Ngày sinh</label>
                  <DatePicker
                    onChange={this.handleOnChangeDatePicker}
                    className="form-control"
                    value={this.state.birthday}
                  />
                </div>
                <div className="col-6 form-group">
                  <label>Giới tính người đặt</label>
                  <Select
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
                onClick={() => this.handleConfirmBooking()}
              >
                Xác nhận
              </button>
              <button
                className="btn-booking-cancel"
                onClick={closeBookingModal}
              >
                Hủy
              </button>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGender: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
