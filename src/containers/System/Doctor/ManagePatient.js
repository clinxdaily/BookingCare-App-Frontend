import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getAllPatientForDoctor,
  postSendRemedy,
  cancelAppointment,
} from "../../../services/userService";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,
    };
  }

  async componentDidMount() {
    await this.getDataPatient();
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
      this.setState({ dataPatient: res.data });
    }
  };

  handleOnChangeDatePicker = (date) => {
    this.setState({ currentDate: date[0] }, async () => {
      await this.getDataPatient();
    });
  };

  sendRemedy = async (dataFromModal) => {
    let { dataModal } = this.state;
    this.setState({ isShowLoading: true });

    let payload = {
      email: dataFromModal.email,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: this.props.language,
      patientName: dataModal.patientName,
      type: dataFromModal.type, // "image" hoặc "manual"
    };

    // Nếu là gửi bằng ảnh
    if (dataFromModal.type === "image") {
      payload.imgBase64List = dataFromModal.imgBase64List;
    }

    // Nếu là gửi bằng nhập tay
    if (dataFromModal.type === "manual") {
      payload.medicines = dataFromModal.medicines.map((med) => ({
        name: med.name,
        quantity: med.quantity,
        unit: med.unit, // 👈 THÊM unit ở đây
        time: med.time,
      }));
      payload.initialDiagnosis = dataFromModal.initialDiagnosis;
      payload.conclusion = dataFromModal.conclusion;
    }

    let res = await postSendRemedy(payload);

    if (res && res.errCode === 0) {
      toast.success(this.props.intl.formatMessage({ id: "doctor.patient.send-success" }));
      this.setState({ isOpenRemedyModal: false, dataModal: {} });
      await this.getDataPatient();
    } else {
      toast.error(this.props.intl.formatMessage({ id: "doctor.patient.send-error" }));
    }

    this.setState({ isShowLoading: false });
  };

  handleOpenRemedy = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    };
    this.setState({ isOpenRemedyModal: true, dataModal: data });
  };

  renderStatus = (statusId) => {
    switch (statusId) {
      case "S2":
        return this.props.intl.formatMessage({ id: "doctor.patient.status-waiting" });
      default:
        return this.props.intl.formatMessage({ id: "doctor.patient.status-unknown" });
    }
  };

  handleCancelAppointment = async (item) => {
    if (
      !item ||
      !item.patientId ||
      !item.doctorId ||
      !item.timeType ||
      !item.date
    ) {
      toast.error(this.props.intl.formatMessage({ id: "doctor.patient.cancel-error" }));
      return;
    }

    const confirm = window.confirm(
      this.props.intl.formatMessage({ id: "doctor.patient.cancel-confirm" })
    );
    if (!confirm) return;

    const res = await cancelAppointment({
      doctorId: item.doctorId,
      patientId: item.patientId,
      timeType: item.timeType,
      date: item.date,
      reason: this.props.intl.formatMessage({ id: "doctor.patient.cancel-reason" }),
    });

    if (res && res.errCode === 0) {
      toast.success(this.props.intl.formatMessage({ id: "doctor.patient.cancel-success" }));
      await this.getDataPatient();
    } else {
      toast.error(res.errMessage || this.props.intl.formatMessage({ id: "doctor.patient.cancel-failed" }));
    }
  };

  renderActionButtons = (item) => {
    if (item.statusId === "S2") {
      return (
        <div className="action-buttons">
          <button
            className="btn btn-primary me-2"
            onClick={() => this.handleOpenRemedy(item)}
          >
            Gửi hóa đơn
          </button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleCancelAppointment(item)}
          >
            Hủy lịch
          </button>
        </div>
      );
    }
    return null;
  };

  render() {
    let { dataPatient, isOpenRemedyModal, dataModal } = this.state;

    return (
      <React.Fragment>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text={this.props.intl.formatMessage({ id: "doctor.patient.sending-email" })}
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
                      <th>Số điện thoại</th>
                      <th>Thời gian khám</th>
                      <th>Lý do khám</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                    {dataPatient && dataPatient.length > 0 ? (
                      dataPatient.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.patientData?.firstName || ""}</td>
                          <td>{item.patientData?.genderData?.valueVi || ""}</td>
                          <td>{item.patientData?.address || ""}</td>
                          <td>{item.patientData?.phonenumber || ""}</td>
                          <td>{item.timeTypeDataPatient?.valueVi || ""}</td>
                          <td>{item.reason || ""}</td>
                          <td>{this.renderStatus(item.statusId)}</td>
                          <td>{this.renderActionButtons(item)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9">Chưa có bệnh nhân nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <RemedyModal
            isOpen={isOpenRemedyModal}
            toggleFromParent={() => this.setState({ isOpenRemedyModal: false })}
            dataRemedy={dataModal}
            sendRemedy={this.sendRemedy}
            isReadOnly={false}
          />
        </LoadingOverlay>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
  user: state.user.userInfo,
});

export default connect(mapStateToProps)(injectIntl(ManagePatient));
