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
    this.state = { allDays: [] };
  }
  async componentDidMount() {
    let { language } = this.props;
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      if (language === LANGUAGES.VI) {
        let labelVi = moment(new Date())
          .add(i, "days")
          .locale("vi")
          .format("dddd - DD/MM");

        object.label = labelVi.charAt(0).toUpperCase() + labelVi.slice(1);
      } else {
        object.label = moment(new Date())
          .add(i, "days")
          .locale("en")
          .format("ddd - DD/MM");
      }

      object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();

      allDays.push(object);
    }

    this.setState({
      allDays: allDays,
    });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
      let allDays = [];
      for (let i = 0; i < 7; i++) {
        let object = {};
        if (this.props.language === LANGUAGES.VI) {
          let labelVi = moment(new Date())
            .add(i, "days")
            .locale("vi")
            .format("dddd - DD/MM");

          object.label = labelVi.charAt(0).toUpperCase() + labelVi.slice(1);
        } else {
          object.label = moment(new Date())
            .add(i, "days")
            .locale("en")
            .format("ddd - DD/MM");
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
  }
  handleOnChangSelect = async (event) => {
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
      let doctorId = this.props.doctorIdFromParent;
      let date = event.target.value;
      let res = await getScheduleDoctorByDate(doctorId, date);
      console.log("check res ", res);
    }
  };
  render() {
    let { allDays } = this.state;
    {
      return (
        <React.Fragment>
          <div className="doctor-schedule-container">
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
            <div className="all-available"></div>
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
