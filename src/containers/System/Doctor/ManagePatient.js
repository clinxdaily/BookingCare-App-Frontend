import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getAllPatientForDoctor,
  postSendRemedy,
  postDoctorConfirm,
  postDoctorReject,
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

  // Bác sĩ xác nhận
  handleConfirm = async (item) => {
    this.setState({ isShowLoading: true });
    try {
      let res = await postDoctorConfirm({
        doctorId: item.doctorId,
        patientId: item.patientId,
        timeType: item.timeType,
        email: item.patientData.email,
        patientName: item.patientData.firstName,
        doctorName: item.doctorName || "Bác sĩ",
        time: item.timeTypeDataPatient?.valueVi || "",
        language: this.props.language,
      });

      if (res && res.errCode === 0) {
        toast.success(`Đã xác nhận bệnh nhân ${item.patientData.firstName}`);
        await this.getDataPatient();
      } else {
        toast.error("Xác nhận thất bại");
      }
    } catch (e) {
      toast.error("Lỗi kết nối máy chủ");
      console.error(e);
    } finally {
      this.setState({ isShowLoading: false });
    }
  };

  // Bác sĩ từ chối
  handleReject = async (item) => {
    let reason = prompt("Nhập lý do từ chối:");
    if (!reason) return;

    this.setState({ isShowLoading: true });
    try {
      let res = await postDoctorReject({
        doctorId: item.doctorId,
        patientId: item.patientId,
        timeType: item.timeType,
        reason,
        email: item.patientData.email,
        patientName: item.patientData.firstName,
        doctorName: item.doctorName || "Bác sĩ",
        time: item.timeTypeDataPatient?.valueVi || "",
        language: this.props.language,
      });

      if (res && res.errCode === 0) {
        toast.error(`Đã từ chối bệnh nhân ${item.patientData.firstName}`);
        await this.getDataPatient();
      } else {
        toast.error("Từ chối thất bại");
      }
    } catch (e) {
      toast.error("Lỗi kết nối máy chủ");
      console.error(e);
    } finally {
      this.setState({ isShowLoading: false });
    }
  };

  // Gửi hóa đơn
  sendRemedy = async (dataFromModal) => {
    let { dataModal } = this.state;
    this.setState({ isShowLoading: true });

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
      toast.success("Gửi hóa đơn thành công!");
      this.setState({ isOpenRemedyModal: false, dataModal: {} });
      await this.getDataPatient();
    } else {
      toast.error("Gửi hóa đơn thất bại!");
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
        return "Chờ bác sĩ xác nhận";
      case "S5":
        return "Đã xác nhận";
      case "S3":
        return "Đã gửi hóa đơn";
      case "S4":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  renderActionButtons = (item) => {
    if (item.statusId === "S2") {
      return (
        <>
          <button
            className="btn btn-success"
            onClick={() => this.handleConfirm(item)}
          >
            Đồng ý
          </button>
          <button
            className="btn btn-danger mx-2"
            onClick={() => this.handleReject(item)}
          >
            Từ chối
          </button>
        </>
      );
    }
    if (item.statusId === "S5") {
      return (
        <button
          className="btn btn-primary"
          onClick={() => this.handleOpenRemedy(item)}
        >
          Gửi hóa đơn
        </button>
      );
    }
    return null; // S3, S4 thì không hiển thị
  };

  render() {
    let { dataPatient, isOpenRemedyModal, dataModal } = this.state;

    return (
      <React.Fragment>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Đang gửi email cho bệnh nhân..."
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
                          <td>{item.timeTypeDataPatient?.valueVi || ""}</td>
                          <td>{this.renderStatus(item.statusId)}</td>
                          <td>{this.renderActionButtons(item)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">Chưa có bệnh nhân nào.</td>
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
            closeRemedyModal={() => this.setState({ isOpenRemedyModal: false })}
            sendRemedy={this.sendRemedy}
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

export default connect(mapStateToProps)(ManagePatient);
