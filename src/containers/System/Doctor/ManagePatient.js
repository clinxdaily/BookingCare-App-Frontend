import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { CRUD_Actions, LANGUAGES, dateFormat } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getAllPatientForDoctor,
  postSendRemedy,
} from "../../../services/userService";
import moment, { lang } from "moment";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      selectedDate: null,
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,
    };
  }
  async componentDidMount() {
    this.getDataPatient();
  }
  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formattedDate = new Date(currentDate).getTime();
    let res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formattedDate,
    });
    if (res && res.errCode === 0) {
      this.setState({
        dataPatient: res.data,
      });
    }
  };
  handleOnChangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    // }
  }
  handleBtnConfirm = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };
  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };
  sendRemedy = async (dataFromModal) => {
    let { dataModal } = this.state;
    this.setState({
      isShowLoading: true,
    });
    let res = await postSendRemedy({
      email: dataFromModal.email,
      imgBase64: dataFromModal.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: this.props.language,
      patientName: dataModal.patientName,
    });
    if (res && res.errCode === 0) {
      this.setState({
        isShowLoading: false,
      });
      toast.success("Gửi hóa đơn thành công!");
      this.setState({
        isOpenRemedyModal: false,
        dataModal: {},
      });
      await this.getDataPatient();
    } else {
      this.setState({
        isShowLoading: false,
      });
      toast.error("Gửi hóa đơn thất bại!");
    }
  };

  render() {
    let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
    console.log("check state: ", this.state);
    return (
      <React.Fragment>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Đang gửi hóa đơn..."
        >
          <div className="manage-patient-container">
            <div className="manage-patient-title">Quản lý bệnh nhân</div>
            <div className="manage-patient-body row">
              <div className="col-6 form-group">
                <label>Chọn ngày khám</label>
                <DatePicker
                  onChange={this.handleOnChangeDatePicker}
                  className="form-control"
                  value={this.state.currentDate}
                />
              </div>
              <div className="col-12">
                <table className="manage-patient-table">
                  <tbody>
                    <tr>
                      <th>STT</th>
                      <th>Họ tên</th>
                      <th>Giới tính</th>
                      <th>Địa chỉ</th>
                      <th>Thời gian khám</th>
                      <th>Hành động</th>
                    </tr>
                    {dataPatient && dataPatient.length > 0 ? (
                      dataPatient.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              {item.patientData && item.patientData.firstName
                                ? item.patientData.firstName
                                : ""}
                            </td>
                            <td>
                              {item.patientData && item.patientData.genderData
                                ? item.patientData.genderData.valueVi
                                : ""}
                            </td>
                            <td>
                              {item.patientData && item.patientData.address
                                ? item.patientData.address
                                : ""}
                            </td>
                            <td>
                              {item.timeTypeDataPatient &&
                              item.timeTypeDataPatient.valueVi
                                ? item.timeTypeDataPatient.valueVi
                                : ""}
                            </td>
                            <td>
                              <button
                                className="btn btn-primary"
                                onClick={() => this.handleBtnConfirm(item)}
                              >
                                Xác nhận và gửi kết quả khám
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6">Chưa có bệnh nhân nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <RemedyModal
            isOpenModal={isOpenRemedyModal}
            dataModal={dataModal}
            closeRemedyModal={this.closeRemedyModal}
            sendRemedy={this.sendRemedy}
          />
        </LoadingOverlay>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
