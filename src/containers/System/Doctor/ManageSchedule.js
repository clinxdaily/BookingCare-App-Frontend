import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { CRUD_Actions, LANGUAGES, dateFormat } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import { toast } from "react-toastify";
import { result } from "lodash";
import { saveBulkScheduleDoctor } from "../../../services/userService";
class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      selectedDate: new Date(),
      allScheduleTimes: [],
    };
  }
  componentDidMount() {
    this.props.fetchAllDoctor();
    this.props.fetchAllScheduleTime();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      });
    }
    if (prevProps.allScheduleTimes !== this.props.allScheduleTimes) {
      let dataSchedule = this.props.allScheduleTimes;
      if (dataSchedule && dataSchedule.length > 0) {
        dataSchedule = dataSchedule.map((item) => ({
          ...item,
          isSelected: false,
        }));
      }
      this.setState({
        allScheduleTimes: dataSchedule,
      });
    }
    // if (prevProps.language !== this.props.language) {
    //   let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
    //   this.setState({
    //     listDoctors: dataSelect,
    //   });
    // }
  }
  buildDataInputSelect = (data) => {
    let result = [];
    let { language } = this.props; // Assuming language is passed as a prop
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        let labelEn = `${item.firstName} ${item.lastName}`;
        let labelVi = `${item.lastName} ${item.firstName}`;
        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };
  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedDoctor: selectedOption });
  };
  handleOnChangeDatePicker = (date) => {
    this.setState({
      selectedDate: date[0],
    });
  };
  handleClickBtnTime = (timeId) => {
    let { allScheduleTimes } = this.state;
    if (allScheduleTimes && allScheduleTimes.length > 0) {
      allScheduleTimes = allScheduleTimes.map((item) => {
        if (item.id === timeId) {
          item.isSelected = !item.isSelected; // Toggle selection
        }
        return item;
      });
      this.setState({
        allScheduleTimes: allScheduleTimes,
      });
    }
  };
  handleSaveSchedule = async () => {
    let { selectedDoctor, selectedDate, allScheduleTimes } = this.state;
    if (!selectedDate) {
      toast.error("Invalid date selected");
      return;
    }
    if (!selectedDoctor || !selectedDoctor.value) {
      toast.error("Invalid doctor selected");
      return;
    }
    // let formattedDate = moment(selectedDate).format(dateFormat.SEND_TO_SERVER);
    let formattedDate = new Date(
      new Date(selectedDate).setHours(0, 0, 0, 0)
    ).getTime();

    let result = []; // ← thêm dòng này
    if (allScheduleTimes && allScheduleTimes.length > 0) {
      let selectedTimes = allScheduleTimes.filter(
        (item) => item.isSelected === true
      );
      if (selectedTimes && selectedTimes.length > 0) {
        selectedTimes.map((time) => {
          let object = {
            doctorId: selectedDoctor.value,
            date: formattedDate,
            timeType: time.keyMap, // nên dùng "timeType" thay vì "time"
          };
          result.push(object);
        });
      } else {
        toast.error("Invalid time selected");
        return;
      }
    }
    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorId: selectedDoctor.value,
      formattedDate: formattedDate,
    });
  };
  render() {
    console.log("check state", this.state);
    let { allScheduleTimes } = this.state;
    let { language } = this.props;
    return (
      <React.Fragment>
        <div className="manage-schedule-container">
          <div className="manage-schedule-title text-center">
            <FormattedMessage id="manage-schedule.title" />
          </div>
          <div className="container">
            <div className="row">
              <div className="col-6 form-group">
                <label>Chọn bác sĩ</label>
                <Select
                  value={this.state.selectedDoctor}
                  onChange={this.handleChangeSelect}
                  options={this.state.listDoctors}
                />
              </div>
              <div className="col-6 form-group">
                <label>Chọn ngày</label>
                <DatePicker
                  onChange={this.handleOnChangeDatePicker}
                  className="form-control"
                  value={this.state.selectedDate}
                  minDate={new Date()}
                />
              </div>
              <div className="col-12 pick-hour-container">
                {allScheduleTimes &&
                  allScheduleTimes.length > 0 &&
                  allScheduleTimes.map((item, index) => {
                    return (
                      <button
                        key={index}
                        className={
                          item.isSelected === true
                            ? "btn btn-schedule selected "
                            : "btn-schedule "
                        }
                        onClick={() => this.handleClickBtnTime(item.id)}
                      >
                        {language === LANGUAGES.VI
                          ? item.valueVi
                          : item.valueEn}
                      </button>
                    );
                  })}
              </div>
              <div className="col-12 text-center mt-3">
                <button
                  className="btn btn-primary"
                  onClick={() => this.handleSaveSchedule()}
                >
                  <FormattedMessage id="manage-schedule.save" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    allDoctors: state.admin.allDoctors,
    language: state.app.language,
    allScheduleTimes: state.admin.allScheduleTime,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctor: () => {
      dispatch(actions.fetchAllDoctor());
    },
    fetchAllScheduleTime: () => {
      dispatch(actions.fetchAllScheduleTime());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
