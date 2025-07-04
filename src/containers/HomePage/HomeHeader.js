import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from "../../store/actions/appActions";
import {
  FaCalendarCheck,
  FaVideo,
  FaHeartbeat,
  FaPills,
  FaQuestionCircle,
} from "react-icons/fa";

class HomeHeader extends Component {
  changeLanguage = (language) => {
    //fire redux event
    this.props.changeLanguageApp(language);
  };

  handleLogin = () => {
    // Handle login logic here
    console.log("Login clicked");
  };

  handleRegister = () => {
    // Handle register logic here
    console.log("Register clicked");
  };

  render() {
    let language = this.props.language;
    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <div className="header-logo"></div>
            </div>
            <div className="center-content">
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="home-header.speciality" />
                  </b>
                </div>
                <div className="subs-tittle">
                  <FormattedMessage id="home-header.search-doctor" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="home-header.medical-facility" />
                  </b>
                </div>
                <div className="subs-tittle">
                  <FormattedMessage id="home-header.select-clinic" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="home-header.doctor" />
                  </b>
                </div>
                <div className="subs-tittle">
                  <FormattedMessage id="home-header.select-doctor" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="home-header.medical-package" />
                  </b>
                </div>
                <div className="subs-tittle">
                  <FormattedMessage id="home-header.genarate-health" />
                </div>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <FaQuestionCircle
                  size={15} // Kích thước (px)
                  color="#000000" // Màu xanh (vd: blue-500)
                  className="cursor-help" // Hiện con trỏ help (?) khi hover
                />
                <FormattedMessage id="home-header.support" />
              </div>

              <div className="language-switcher">
                <div
                  className={
                    language === LANGUAGES.VI
                      ? "language-vi active"
                      : "language-vi"
                  }
                >
                  <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>
                    VN{" "}
                    <img
                      src="https://flagcdn.com/w40/vn.png"
                      alt="Vietnam Flag"
                      width="20"
                    />
                  </span>
                </div>
                <div
                  className={
                    language === LANGUAGES.EN
                      ? "language-en active"
                      : "language-en"
                  }
                >
                  <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>
                    EN{" "}
                    <img
                      src="https://flagcdn.com/w40/us.png"
                      alt="English Flag"
                      width="20"
                    />
                  </span>
                </div>
              </div>

              <div className="auth-buttons">
                <button className="login-btn" onClick={this.handleLogin}>
                  <FormattedMessage
                    id="home-header.login"
                    defaultMessage="Đăng nhập"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        {this.props.isShowBanner === true && (
          <div className="home-header-banner">
            <div className="banner-overlay"></div>
            <div className="banner-content">
              <div className="main-title">
                <div className="title-1">
                  <FormattedMessage
                    id="banner.title-1"
                    defaultMessage="NỀN TẢNG Y TẾ"
                  />
                </div>
                <div className="title-highlight">
                  <FormattedMessage id="banner.title-highlight" />
                </div>
                <div className="title-2">
                  <FormattedMessage
                    id="banner.title-2"
                    defaultMessage="Kết nối bạn với các bác sĩ hàng đầu"
                  />
                </div>
              </div>

              <div className="subtitle-section">
                <p className="subtitle">
                  <FormattedMessage
                    id="banner.subtitle"
                    defaultMessage="Đặt lịch khám nhanh chóng • Tư vấn trực tuyến • Theo dõi sức khỏe"
                  />
                </p>
              </div>

              <div className="search-section">
                <div className="search">
                  <i className="fas fa-search"></i>
                  <FormattedMessage
                    id="banner.search-placeholder"
                    defaultMessage="Tìm bác sĩ, chuyên khoa, bệnh viện..."
                  >
                    {(placeholder) => (
                      <input type="text" placeholder={placeholder} />
                    )}
                  </FormattedMessage>
                  <button className="search-btn">
                    <FormattedMessage
                      id="banner.search"
                      defaultMessage="Tìm kiếm"
                    />
                  </button>
                </div>
              </div>

              <div className="quick-actions">
                <div className="action-item">
                  <div className="action-icon">
                    <FaCalendarCheck
                      size={24} // Kích thước (px)
                      color="#ffffff" // Màu sắc
                      className="mr-2"
                    />
                  </div>
                  <div className="action-text">
                    <FormattedMessage
                      id="banner.book-appointment"
                      defaultMessage="Đặt lịch khám"
                    />
                  </div>
                </div>
                <div className="action-item">
                  <div className="action-icon">
                    <FaVideo
                      size={24} // Kích thước (px)
                      color="#ffffff" // Màu (ví dụ: blue-500)
                      className="mr-2" // Thêm margin hoặc CSS class
                    />
                  </div>
                  <div className="action-text">
                    <FormattedMessage
                      id="banner.online-consultation"
                      defaultMessage="Tư vấn trực tuyến"
                    />
                  </div>
                </div>
                <div className="action-item">
                  <div className="action-icon">
                    <FaHeartbeat
                      size={24} // Kích thước (px)
                      color="#ffffff" // Màu đỏ (ví dụ: red-600)
                      className="animate-pulse" // Hiệu ứng nhấp nháy (nếu dùng Tailwind)
                    />
                  </div>
                  <div className="action-text">
                    <FormattedMessage
                      id="banner.health-checkup"
                      defaultMessage="Khám tổng quát"
                    />
                  </div>
                </div>
                <div className="action-item">
                  <div className="action-icon">
                    <FaPills
                      size={24} // Kích thước (px)
                      color="#ffffff" // Màu tím (ví dụ: purple-500)
                      className="mr-2" // Thêm khoảng cách bên phải
                    />
                  </div>
                  <div className="action-text">
                    <FormattedMessage
                      id="banner.pharmacy"
                      defaultMessage="Nhà thuốc"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageApp: (language) => dispatch(changeLanguageApp(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
