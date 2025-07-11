import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import { FormattedMessage } from "react-intl";
import {
  getDetailInFoDoctor,
  getScheduleDoctorByDate,
} from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import moment from "moment";
import "moment/locale/vi";
import BookingModal from "./Modal/BookingModal";
class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDays: [],
      allAvailableTime: [],
      isOpenModalBooking: false,
      dataScheduleTimeModal: {},
    };
  }
  async componentDidMount() {
    this.setAllDaysAndFetchSchedule();
  }

  async componentDidUpdate(prevProps) {
    if (
      prevProps.language !== this.props.language ||
      prevProps.doctorIdFromParent !== this.props.doctorIdFromParent
    ) {
      this.setAllDaysAndFetchSchedule();
    }
  }

  // Hàm dùng chung để set allDays và gọi lịch ngày đầu tiên
  setAllDaysAndFetchSchedule = async () => {
    let { language, doctorIdFromParent } = this.props;
    let allDays = [];

    for (let i = 0; i < 7; i++) {
      let date = moment(new Date()).add(i, "days");
      let label = "";

      if (language === LANGUAGES.VI) {
        label =
          i === 0
            ? `Hôm nay - ${date.format("DD/MM")}`
            : date.locale("vi").format("dddd - DD/MM");
      } else {
        label =
          i === 0
            ? `Today - ${date.format("DD/MM")}`
            : date.locale("en").format("ddd - DD/MM");
      }

      allDays.push({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        value: date.startOf("day").valueOf(),
      });
    }

    this.setState({ allDays });

    // Gọi lịch bác sĩ cho ngày đầu tiên
    if (doctorIdFromParent) {
      let res = await getScheduleDoctorByDate(
        doctorIdFromParent,
        allDays[0].value
      );
      this.setState({
        allAvailableTime: res && res.data ? res.data : [],
      });
    }
  };

  handleOnChangSelect = async (event) => {
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
      let doctorId = this.props.doctorIdFromParent;
      let date = event.target.value;
      let res = await getScheduleDoctorByDate(doctorId, date);

      if (res && res.errCode === 0) {
        // allTime = res.data;
        this.setState({ allAvailableTime: res.data ? res.data : [] });
      } else {
      }
    }
  };
  handleClickScheduleTime = (time) => {
    this.setState({
      isOpenModalBooking: true,
      dataScheduleTimeModal: time,
    });
  };
  closeBookingModal = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };
  render() {
    let {
      allDays,
      allAvailableTime,
      isOpenModalBooking,
      dataScheduleTimeModal,
    } = this.state;
    let { language } = this.props;
    {
      return (
        <React.Fragment>
          <div className="doctor-schedule-container">
            <div className="left-content">
              <div className="all-schedule">
                <select onChange={(event) => this.handleOnChangSelect(event)}>
                  {allDays &&
                    allDays.length > 0 &&
                    allDays.map((item, index) => {
                      return (
                        <option value={item.value} key={index}>
                          {item.label}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="all-available">
                <div className="text-calender">
                  <span>
                    <i className="fas fa-calendar-alt">
                      {" "}
                      <FormattedMessage id="doctor-schedule.title" />
                    </i>
                  </span>
                </div>
                <div className="time-content">
                  {allAvailableTime && allAvailableTime.length > 0 ? (
                    allAvailableTime.map((item, index) => {
                      let timeDisplay =
                        language === LANGUAGES.VI
                          ? item.timeTypeData.valueVi
                          : item.timeTypeData.valueEn;
                      return (
                        <button
                          key={index}
                          onClick={() => this.handleClickScheduleTime(item)}
                        >
                          {timeDisplay}
                        </button>
                      );
                    })
                  ) : (
                    <div>
                      <FormattedMessage id="doctor-schedule.notice" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <BookingModal
            isOpenModal={isOpenModalBooking}
            closeBookingModal={this.closeBookingModal}
            dataTime={dataScheduleTimeModal}
          />
        </React.Fragment>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
