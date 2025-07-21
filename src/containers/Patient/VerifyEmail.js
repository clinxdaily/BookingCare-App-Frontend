import React, { Component } from "react";
import { connect } from "react-redux";
import "./VerifyEmail.scss";
import HomeFooter from "../HomePage/HomeFooter";
import { postVerifyBookAppointment } from "../../services/userService";
import HomeHeader from "../HomePage/HomeHeader";

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = { statusVerify: false, errCode: 0 };
  }

  async componentDidMount() {
    if (this.props.location && this.props.location.search) {
      let urlParams = new URLSearchParams(this.props.location.search);
      let token = urlParams.get("token");
      let doctorId = urlParams.get("doctorId");

      let res = await postVerifyBookAppointment({
        token: token,
        doctorId: doctorId,
      });

      if (res && res.errCode === 0) {
        this.setState({ statusVerify: true, errCode: 0 });
      } else {
        this.setState({
          statusVerify: true,
          errCode: res?.errCode || -1,
        });
      }
    }
  }

  render() {
    let { statusVerify, errCode } = this.state;

    return (
      <>
        <HomeHeader />
        <div className="verify-email-container">
          {!statusVerify ? (
            <div className="info-booking loading">
              Đang xác nhận lịch hẹn của bạn, vui lòng chờ...
              <br />
              Verifying your appointment, please wait...
            </div>
          ) : (
            <div className="info-booking">
              {errCode === 0 ? (
                <>
                  {/* ✅ SUCCESS - TIẾNG VIỆT */}
                  <div className="vi">
                    <h2>🎉 Lịch hẹn của bạn đã được xác nhận!</h2>
                    <p>
                      Cảm ơn bạn đã tin tưởng và đặt lịch khám tại{" "}
                      <strong>HealthCare</strong>.
                    </p>
                    <p>
                      Thông tin lịch hẹn đã được xác thực thành công. Vui lòng
                      kiểm tra email để biết thêm chi tiết.
                    </p>
                    <p>
                      Nếu bạn cần hỗ trợ, hãy liên hệ với chúng tôi qua các kênh
                      hiển thị trên website.
                    </p>
                    <p className="footer-note">
                      Chúc bạn một ngày an lành và sức khỏe dồi dào! ❤️
                    </p>
                  </div>
                  <hr className="divider" />

                  {/* ✅ SUCCESS - ENGLISH */}
                  <div className="en" style={{ marginTop: "30px" }}>
                    <h2>🎉 Your appointment has been confirmed!</h2>
                    <p>
                      Thank you for booking your appointment with{" "}
                      <strong>HealthCare</strong>.
                    </p>
                    <p>
                      Your appointment has been successfully verified. Please
                      check your email for more details.
                    </p>
                    <p>
                      If you need support, feel free to contact us through the
                      channels listed on the website.
                    </p>
                    <p className="footer-note">
                      Wishing you a wonderful day and great health! ❤️
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* ❌ FAILED - TIẾNG VIỆT */}
                  <div className="vi">
                    <h2>❌ Xác nhận thất bại</h2>
                    <p>Rất tiếc! Lịch hẹn của bạn không thể được xác nhận.</p>
                    <p>
                      Mã xác nhận có thể đã hết hạn hoặc không hợp lệ. Vui lòng
                      kiểm tra lại email hoặc thử đặt lịch lại.
                    </p>
                  </div>
                  <hr className="divider" />

                  {/* ❌ FAILED - ENGLISH */}
                  <div className="en" style={{ marginTop: "30px" }}>
                    <h2>❌ Verification Failed</h2>
                    <p>Sorry! Your appointment could not be verified.</p>
                    <p>
                      The verification token might have expired or is invalid.
                      Please check your email again or try booking another
                      appointment.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <HomeFooter />
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
