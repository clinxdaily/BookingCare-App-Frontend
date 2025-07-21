import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import { FormattedMessage } from "react-intl";
import { getScheduleDoctorByDate } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import moment from "moment";
import "moment/locale/vi";
import BookingModal from "./Modal/BookingModal";

class DoctorSchedule extends Component {
  state = {
    allDays: [],
    selectedDate: "",
    allAvailableTime: [],
    isOpenModalBooking: false,
    dataScheduleTimeModal: {},
  };

  async componentDidMount() {
    const allDays = this.buildDays(this.props.language);
    this.setState(
      {
        allDays,
        selectedDate: allDays[0]?.value || "",
      },
      () => {
        if (this.props.doctorIdFromParent) {
          this.loadSchedule(
            this.props.doctorIdFromParent,
            this.state.selectedDate
          );
        }
      }
    );
  }

  async componentDidUpdate(prevProps) {
    const { language, doctorIdFromParent } = this.props;

    // Đổi ngôn ngữ: rebuild label nhưng giữ selectedDate cũ
    if (prevProps.language !== language) {
      const allDays = this.buildDays(language);
      this.setState({ allDays }, () => {
        if (doctorIdFromParent && this.state.selectedDate) {
          this.loadSchedule(doctorIdFromParent, this.state.selectedDate);
        }
      });
    }

    // Bác sĩ đổi (hoặc lần đầu có id)
    if (
      prevProps.doctorIdFromParent !== doctorIdFromParent &&
      doctorIdFromParent
    ) {
      const dateVal = this.state.selectedDate || this.state.allDays[0]?.value;
      this.loadSchedule(doctorIdFromParent, dateVal);
    }
  }

  buildDays = (language) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = moment().add(i, "days");
      const base =
        language === LANGUAGES.VI
          ? i === 0
            ? `Hôm nay - ${date.format("DD/MM")}`
            : date.locale("vi").format("dddd - DD/MM")
          : i === 0
          ? `Today - ${date.format("DD/MM")}`
          : date.locale("en").format("ddd - DD/MM");
      days.push({
        label: base.charAt(0).toUpperCase() + base.slice(1),
        value: date.startOf("day").valueOf().toString(), // string cho <select>
      });
    }
    return days;
  };

  // lọc slot hôm nay
  filterTodaySlots = (slots, dateValue) => {
    const todayStart = moment().startOf("day").valueOf().toString();
    if (dateValue !== todayStart) return slots;

    const { language } = this.props;
    const now = moment();
    const nowMins = now.hours() * 60 + now.minutes();

    return (slots || []).filter((s) => {
      const label =
        language === LANGUAGES.VI
          ? s.timeTypeData?.valueVi
          : s.timeTypeData?.valueEn;
      if (!label) return true;
      // lấy HH:mm đầu tiên tìm thấy
      let hh = 0,
        mm = 0;
      let m = label.match(/(\d{1,2})[:hH](\d{2})/); // match 08:00, 8:00, 8h00
      if (m) {
        hh = +m[1];
        mm = +m[2];
      } else {
        // fallback nếu format kiểu "Sáng", "Chiều": luôn hiển thị
        return true;
      }
      const slotMins = hh * 60 + mm;
      return slotMins > nowMins;
    });
  };

  loadSchedule = async (doctorId, dateValue) => {
    const res = await getScheduleDoctorByDate(doctorId, dateValue);
    let data =
      res && res.errCode === 0 && Array.isArray(res.data) ? res.data : [];
    data = this.filterTodaySlots(data, dateValue);
    this.setState({ allAvailableTime: data });
  };

  handleOnChangSelect = async (e) => {
    const dateValue = e.target.value;
    this.setState({ selectedDate: dateValue, allAvailableTime: [] });
    if (this.props.doctorIdFromParent) {
      this.loadSchedule(this.props.doctorIdFromParent, dateValue);
    }
  };

  handleClickScheduleTime = (time) => {
    this.setState({
      isOpenModalBooking: true,
      dataScheduleTimeModal: time,
    });
  };

  closeBookingModal = () => {
    this.setState({ isOpenModalBooking: false });
  };

  render() {
    const {
      allDays,
      selectedDate,
      allAvailableTime,
      isOpenModalBooking,
      dataScheduleTimeModal,
    } = this.state;
    const { language } = this.props;

    return (
      <>
        <div className="doctor-schedule-container">
          <div className="left-content">
            <div className="all-schedule">
              <select value={selectedDate} onChange={this.handleOnChangSelect}>
                {allDays.map((d, i) => (
                  <option value={d.value} key={i}>
                    {d.label}
                  </option>
                ))}
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
                {allAvailableTime.length > 0 ? (
                  allAvailableTime.map((item, idx) => {
                    const timeDisplay =
                      language === LANGUAGES.VI
                        ? item.timeTypeData?.valueVi
                        : item.timeTypeData?.valueEn;
                    return (
                      <button
                        key={idx}
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
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
});

export default connect(mapStateToProps)(DoctorSchedule);
