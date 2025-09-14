import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageHistory.scss";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import { toast } from "react-toastify";
import {
  getHistoryAppointment,
  getRemedyByBooking,
} from "../../../services/userService";
import RemedyModal from "./RemedyModal";

class ManageHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataHistory: [],
      isOpenRemedyModal: false,
      currentRemedyData: null,
    };
  }

  componentDidMount() {
    this.fetchHistory();
  }

  fetchHistory = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formattedDate = new Date(currentDate).getTime();

    let res = await getHistoryAppointment(user.id, formattedDate);
    if (res && res.errCode === 0) {
      this.setState({ dataHistory: res.data });
    }
  };

  renderStatus = (statusId) => {
    switch (statusId) {
      case "S3":
        return "Đã khám";
      case "S4":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  handleViewRemedy = async (item) => {
    try {
      let res = await getRemedyByBooking({
        bookingId: item.id, // ✅ gửi đúng ID
      });

      if (res && res.errCode === 0) {
        this.setState({
          isOpenRemedyModal: true,
          currentRemedyData: res.data,
        });
      } else {
        toast.error("Không tìm thấy đơn thuốc!");
      }
    } catch (error) {
      toast.error("Lỗi khi tải đơn thuốc!");
    }
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      currentRemedyData: null,
    });
  };

  render() {
    let { dataHistory, isOpenRemedyModal, currentRemedyData } = this.state;

    return (
      <div className="manage-history-container">
        <div className="manage-history-title">Quản lý lịch sử khám bệnh</div>
        <div className="col-12 mt-3">
          <table className="manage-history-table table table-bordered">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ tên</th>
                <th>Giới tính</th>
                <th>Địa chỉ</th>
                <th>SĐT</th>
                <th>Thời gian</th>
                <th>Lý do khám</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dataHistory && dataHistory.length > 0 ? (
                dataHistory.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.patientData?.firstName || "Không có"}</td>
                    <td>
                      {item.patientData?.genderData?.valueVi || "Không có"}
                    </td>
                    <td>{item.patientData?.address || "Không có"}</td>
                    <td>{item.patientData?.phonenumber || ""}</td>
                    <td>
                      {item.timeTypeDataPatient?.valueVi || ""} -{" "}
                      {moment(+item.date).format("DD/MM/YYYY")}
                    </td>
                    <td>{item.reason || ""}</td>
                    <td>{this.renderStatus(item.statusId)}</td>
                    <td>
                      {item.statusId === "S3" ? (
                        <button
                          className="btn btn-primary"
                          onClick={() => this.handleViewRemedy(item)}
                        >
                          Xem chi tiết
                        </button>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    Không có lịch sử khám bệnh.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <RemedyModal
          isOpen={isOpenRemedyModal}
          toggleFromParent={this.closeRemedyModal}
          dataRemedy={currentRemedyData}
          isReadOnly={true} // 👈 chế độ xem
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
  user: state.user.userInfo,
});

export default connect(mapStateToProps)(ManageHistory);
