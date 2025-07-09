import React, { Component } from "react";
import { connect } from "react-redux";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import { FormattedMessage } from "react-intl";
import { classNames } from "react-select/dist/index-ea9e225d.cjs.prod";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {}
  async componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    let { isOpenModal, closeBookingModal, dataTime } = this.props;
    let doctorId = "";
    if (dataTime && !_.isEmpty(dataTime)) {
      doctorId = dataTime.doctorId;
    }

    return (
      <React.Fragment>
        <Modal
          isOpen={isOpenModal}
          className={"booking-modal-container"}
          size="xl"
          centered
          //   backdrop={true}
        >
          <div className="booking-modal-content">
            <div className="booking-modal-header">
              <span className="left">Thông tin đặt lịch khám bệnh</span>
              <span className="right" onClick={closeBookingModal}>
                <i className="fas fa-times"></i>
              </span>
            </div>
            <div className="booking-modal-body">
              <div className="doctor-info">
                <ProfileDoctor
                  doctorId={doctorId}
                  isShowIntro={false}
                  dataTime={dataTime}
                />
              </div>

              <div className="row ">
                <div className="col-6 form-group">
                  <label>Họ tên người đặt</label>
                  <input className="form-control"></input>
                </div>
                <div className="col-6 form-group">
                  <label>Số điện thoại người đặt</label>
                  <input className="form-control"></input>
                </div>
                <div className="col-6 form-group">
                  <label>Email người đặt</label>
                  <input className="form-control"></input>
                </div>
                <div className="col-6 form-group">
                  <label>Địa chỉ người đặt</label>
                  <input className="form-control"></input>
                </div>
                <div className="col-12 form-group">
                  <label>Lý do/Triệu chứng đặt khám </label>
                  <input className="form-control"></input>
                </div>
                <div className="col-6 form-group">
                  <label>Đặt cho</label>
                  <input className="form-control"></input>
                </div>
                <div className="col-6 form-group">
                  <label>Giới tính người đặt</label>
                  <input className="form-control"></input>
                </div>
              </div>
            </div>
            <div className="booking-modal-footer">
              <button className="btn-booking-confirm">Xác nhận</button>
              <button
                className="btn-booking-cancel"
                onClick={closeBookingModal}
              >
                Hủy
              </button>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
