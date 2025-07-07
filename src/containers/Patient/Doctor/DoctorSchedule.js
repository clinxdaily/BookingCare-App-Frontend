import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import {
  getDetailInFoDoctor,
  getScheduleDoctorByDate,
} from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import moment from "moment";
import localization from "moment/locale/vi";
class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = { allDays: [], allAvailableTime: [] };
  }
  async componentDidMount() {
    let { language } = this.props;
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      let date = moment(new Date()).add(i, "days");

      if (language === LANGUAGES.VI) {
        if (i === 0) {
          object.label = `Hôm nay - ${date.format("DD/MM")}`;
        } else {
          let labelVi = date.locale("vi").format("dddd - DD/MM");
          object.label = labelVi.charAt(0).toUpperCase() + labelVi.slice(1);
        }
      } else {
        if (i === 0) {
          object.label = `Today - ${date.format("DD/MM")}`;
        } else {
          object.label = date.locale("en").format("ddd - DD/MM");
        }
      }

      object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();

      allDays.push(object);
    }

    this.setState({
      allDays: allDays,
    });
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
      let allDays = [];
      for (let i = 0; i < 7; i++) {
        let object = {};
        let date = moment(new Date()).add(i, "days");

        if (this.props.language === LANGUAGES.VI) {
          if (i === 0) {
            object.label = `Hôm nay - ${date.format("DD/MM")}`;
          } else {
            let labelVi = date.locale("vi").format("dddd - DD/MM");
            object.label = labelVi.charAt(0).toUpperCase() + labelVi.slice(1);
          }
        } else {
          if (i === 0) {
            object.label = `Today - ${date.format("DD/MM")}`;
          } else {
            object.label = date.locale("en").format("ddd - DD/MM");
          }
        }

        object.value = moment(new Date())
          .add(i, "days")
          .startOf("day")
          .valueOf();

        allDays.push(object);
      }

      this.setState({
        allDays: allDays,
      });
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let allDays = this.state.allDays;
      let res = await getScheduleDoctorByDate(
        this.props.doctorIdFromParent,
        allDays[0].value
      );
      this.setState({
        allAvailableTime: res.data ? res.data : [],
      });
    }
  }
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
  render() {
    let { allDays, allAvailableTime } = this.state;
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
                      Lịch khám - Chọn và đặt miễn phí
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
                      return <button key={index}>{timeDisplay}</button>;
                    })
                  ) : (
                    <div>
                      Bác sĩ không có lịch khám trong ngày hôm nay. Vui lòng
                      chọn ngày khác
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="right-content">qwdqjwkdhqwh</div>
          </div>
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
