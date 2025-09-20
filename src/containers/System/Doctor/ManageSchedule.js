import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage, injectIntl } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import {
  saveBulkScheduleDoctor,
  deleteScheduleByDoctor,
  getScheduleDoctorByDate,
} from "../../../services/userService";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      selectedDate: new Date(),
      allScheduleTimes: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this.props.fetchAllScheduleTime();
    const { userInfo } = this.props;
    if (userInfo && userInfo.roleId === "R1") {
      this.props.fetchAllDoctor();
    } else if (userInfo && userInfo.roleId === "R2") {
      this.setState({
        selectedDoctor: {
          value: userInfo.id,
          label: `${userInfo.lastName} ${userInfo.firstName}`,
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
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
  }

  buildDataInputSelect = (data) => {
    let result = [];
    let { language } = this.props;
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        let labelEn = `${item.firstName} ${item.lastName}`;
        let labelVi = `${item.lastName} ${item.firstName}`;
        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
        return object;
      });
    }
    return result;
  };

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedDoctor: selectedOption });
    this.loadExistingSchedule(selectedOption, this.state.selectedDate);
  };

  handleOnChangeDatePicker = async (date) => {
    const selected = date[0];
    this.setState({ selectedDate: selected });
    this.loadExistingSchedule(this.state.selectedDoctor, selected);
  };

  handleClickBtnTime = async (timeId) => {
    let { allScheduleTimes, selectedDoctor, selectedDate } = this.state;
    const selectedDateTimestamp = new Date(
      new Date(selectedDate).setHours(0, 0, 0, 0)
    ).getTime();

    this.setState({ isLoading: true });
    try {
      const updatedTimes = await Promise.all(
        allScheduleTimes.map(async (item) => {
          if (item.id === timeId) {
            if (item.isSelected && item.isExisting) {
              const res = await deleteScheduleByDoctor(
                selectedDoctor.value,
                selectedDateTimestamp,
                item.keyMap
              );
              if (res && res.errCode === 0) {
                toast.success(this.props.intl.formatMessage({ id: "doctor.schedule.delete-success" }));
                return { ...item, isSelected: false, isExisting: false };
              } else {
                toast.error(this.props.intl.formatMessage({ id: "doctor.schedule.delete-failed" }));
                return item;
              }
            } else {
              const res = await saveBulkScheduleDoctor({
                arrSchedule: [
                  {
                    doctorId: selectedDoctor.value,
                    date: selectedDateTimestamp,
                    timeType: item.keyMap,
                  },
                ],
                doctorId: selectedDoctor.value,
                formattedDate: selectedDateTimestamp,
              });
              if (res && res.errCode === 0) {
                toast.success(this.props.intl.formatMessage({ id: "doctor.schedule.add-success" }));
                return { ...item, isSelected: true, isExisting: true };
              } else {
                toast.error(this.props.intl.formatMessage({ id: "doctor.schedule.add-failed" }));
                return item;
              }
            }
          }
          return item;
        })
      );
      this.setState({ allScheduleTimes: updatedTimes });
    } catch (error) {
      console.error(error);
      toast.error(this.props.intl.formatMessage({ id: "doctor.schedule.general-error" }));
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSaveSchedule = async () => {
    let { selectedDoctor, selectedDate, allScheduleTimes } = this.state;
    if (!selectedDate) {
      toast.error(this.props.intl.formatMessage({ id: "doctor.schedule.invalid-date" }));
      return;
    }
    if (!selectedDoctor || !selectedDoctor.value) {
      toast.error(this.props.intl.formatMessage({ id: "doctor.schedule.invalid-doctor" }));
      return;
    }

    let formattedDate = new Date(
      new Date(selectedDate).setHours(0, 0, 0, 0)
    ).getTime();

    let result = [];
    let selectedTimes = allScheduleTimes.filter((item) => item.isSelected);
    if (!selectedTimes || selectedTimes.length === 0) {
      toast.error(this.props.intl.formatMessage({ id: "doctor.schedule.no-time-selected" }));
      return;
    }

    selectedTimes.forEach((time) => {
      result.push({
        doctorId: selectedDoctor.value,
        date: formattedDate,
        timeType: time.keyMap,
      });
    });

    this.setState({ isLoading: true });
    try {
      let res = await saveBulkScheduleDoctor({
        arrSchedule: result,
        doctorId: selectedDoctor.value,
        formattedDate: formattedDate,
      });
      if (res && res.errCode === 0) {
        toast.success(this.props.intl.formatMessage({ id: "doctor.schedule.save-success" }));
      } else {
        toast.error(this.props.intl.formatMessage({ id: "doctor.schedule.save-failed" }));
      }
    } catch (error) {
      console.error(error);
      toast.error(this.props.intl.formatMessage({ id: "doctor.schedule.general-error" }));
    } finally {
      this.setState({ isLoading: false });
    }
  };

  loadExistingSchedule = async (selectedDoctor, selectedDate) => {
    if (!selectedDoctor?.value || !selectedDate) return;

    const formattedDate = new Date(
      new Date(selectedDate).setHours(0, 0, 0, 0)
    ).getTime();

    this.setState({ isLoading: true });
    try {
      const res = await getScheduleDoctorByDate(
        selectedDoctor.value,
        formattedDate
      );

      if (res && res.errCode === 0 && Array.isArray(res.data)) {
        const existingTimeTypes = res.data.map((item) => item.timeType);
        const updatedTimes = this.state.allScheduleTimes.map((time) => ({
          ...time,
          isSelected: existingTimeTypes.includes(time.keyMap),
          isExisting: existingTimeTypes.includes(time.keyMap),
        }));

        this.setState({ allScheduleTimes: updatedTimes });
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    let { allScheduleTimes, selectedDate, selectedDoctor, listDoctors } =
      this.state;
    let { language, userInfo } = this.props;
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

    return (
      <LoadingOverlay
        active={this.state.isLoading}
        spinner
        text="Đang xử lý..."
      >
        <div className="manage-schedule-container">
          <div className="manage-schedule-title text-center">
            <FormattedMessage id="manage-schedule.title" />
          </div>
          <div className="container">
            <div className="row">
              {userInfo?.roleId === "R1" && (
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="manage-schedule.choose-doctor" />
                  </label>
                  <Select
                    value={selectedDoctor}
                    onChange={this.handleChangeSelect}
                    options={listDoctors}
                  />
                </div>
              )}
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="manage-schedule.choose-date" />
                </label>
                <DatePicker
                  onChange={this.handleOnChangeDatePicker}
                  className="form-control"
                  value={selectedDate}
                  minDate={yesterday}
                />
              </div>
              <div className="col-12 pick-hour-container">
                {allScheduleTimes &&
                  allScheduleTimes.map((item, index) => (
                    <button
                      key={index}
                      className={
                        item.isSelected
                          ? "btn btn-schedule selected"
                          : "btn btn-schedule"
                      }
                      onClick={() => this.handleClickBtnTime(item.id)}
                    >
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </button>
                  ))}
              </div>
              <div className="col-12 text-center mt-3">
                <button
                  className="btn btn-primary"
                  onClick={this.handleSaveSchedule}
                >
                  <FormattedMessage id="manage-schedule.save" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    allDoctors: state.admin.allDoctors,
    language: state.app.language,
    allScheduleTimes: state.admin.allScheduleTime,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageSchedule));
