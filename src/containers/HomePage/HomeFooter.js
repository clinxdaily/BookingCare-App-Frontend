import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./HomeFooter.scss";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaHeartbeat,
  FaCalendarCheck,
  FaVideo,
  FaPills,
  FaStethoscope,
  FaUserMd,
  FaHospital,
  FaAward,
  FaShieldAlt,
  FaCertificate,
  FaPhoneAlt,
  FaQuestionCircle,
} from "react-icons/fa";

class HomeFooter extends Component {
  handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  handleContactClick = (type) => {
    console.log(`Contact via ${type} clicked`);
  };

  handleServiceClick = (service) => {
    console.log(`Service ${service} clicked`);
  };

  render() {
    return (
      <React.Fragment>
        <footer className="home-footer-container">
          <div className="footer-content">
            {/* Main Footer Content */}
            <div className="footer-main">
              <div className="footer-section company-info">
                <div className="footer-logo"></div>
                <div className="company-description">
                  <FormattedMessage
                    id="footer.company-description"
                    defaultMessage="Nền tảng y tế hàng đầu, kết nối bạn với các bác sĩ chuyên nghiệp và dịch vụ chăm sóc sức khỏe tốt nhất."
                  />
                </div>
                <div className="certifications">
                  <div className="cert-item">
                    <FaAward className="cert-icon" />
                    <span>
                      <FormattedMessage
                        id="footer.cert-award"
                        defaultMessage="Giải thưởng Y tế 2024"
                      />
                    </span>
                  </div>
                  <div className="cert-item">
                    <FaShieldAlt className="cert-icon" />
                    <span>
                      <FormattedMessage
                        id="footer.cert-security"
                        defaultMessage="Bảo mật ISO 27001"
                      />
                    </span>
                  </div>
                  <div className="cert-item">
                    <FaCertificate className="cert-icon" />
                    <span>
                      <FormattedMessage
                        id="footer.cert-quality"
                        defaultMessage="Chứng nhận Chất lượng"
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div className="footer-section services">
                <h3>
                  <FormattedMessage
                    id="footer.services-title"
                    defaultMessage="Dịch vụ"
                  />
                </h3>
                <ul>
                  <li onClick={() => this.handleServiceClick("booking")}>
                    <FaCalendarCheck className="service-icon" />
                    <FormattedMessage
                      id="footer.service-booking"
                      defaultMessage="Đặt lịch khám"
                    />
                  </li>
                  <li onClick={() => this.handleServiceClick("consultation")}>
                    <FaVideo className="service-icon" />
                    <FormattedMessage
                      id="footer.service-consultation"
                      defaultMessage="Tư vấn trực tuyến"
                    />
                  </li>
                  <li onClick={() => this.handleServiceClick("checkup")}>
                    <FaHeartbeat className="service-icon" />
                    <FormattedMessage
                      id="footer.service-checkup"
                      defaultMessage="Khám tổng quát"
                    />
                  </li>
                  <li onClick={() => this.handleServiceClick("pharmacy")}>
                    <FaPills className="service-icon" />
                    <FormattedMessage
                      id="footer.service-pharmacy"
                      defaultMessage="Nhà thuốc trực tuyến"
                    />
                  </li>
                  <li onClick={() => this.handleServiceClick("specialist")}>
                    <FaStethoscope className="service-icon" />
                    <FormattedMessage
                      id="footer.service-specialist"
                      defaultMessage="Bác sĩ chuyên khoa"
                    />
                  </li>
                </ul>
              </div>

              <div className="footer-section quick-links">
                <h3>
                  <FormattedMessage
                    id="footer.quick-links-title"
                    defaultMessage="Liên kết nhanh"
                  />
                </h3>
                <ul>
                  <li>
                    <FaUserMd className="link-icon" />
                    <FormattedMessage
                      id="footer.link-doctors"
                      defaultMessage="Danh sách bác sĩ"
                    />
                  </li>
                  <li>
                    <FaHospital className="link-icon" />
                    <FormattedMessage
                      id="footer.link-hospitals"
                      defaultMessage="Bệnh viện & Phòng khám"
                    />
                  </li>
                  <li>
                    <FaQuestionCircle className="link-icon" />
                    <FormattedMessage
                      id="footer.link-faq"
                      defaultMessage="Câu hỏi thường gặp"
                    />
                  </li>
                  <li>
                    <FormattedMessage
                      id="footer.link-about"
                      defaultMessage="Về chúng tôi"
                    />
                  </li>
                  <li>
                    <FormattedMessage
                      id="footer.link-careers"
                      defaultMessage="Tuyển dụng"
                    />
                  </li>
                  <li>
                    <FormattedMessage
                      id="footer.link-news"
                      defaultMessage="Tin tức y tế"
                    />
                  </li>
                </ul>
              </div>

              <div className="footer-section contact-info">
                <h3>
                  <FormattedMessage
                    id="footer.contact-title"
                    defaultMessage="Liên hệ"
                  />
                </h3>
                <div className="contact-items">
                  <div
                    className="contact-item"
                    onClick={() => this.handleContactClick("phone")}
                  >
                    <FaPhoneAlt className="contact-icon" />
                    <div className="contact-details">
                      <span className="contact-label">
                        <FormattedMessage
                          id="footer.contact-hotline"
                          defaultMessage="Hotline 24/7"
                        />
                      </span>
                      <span className="contact-value">0363 437 706</span>
                    </div>
                  </div>
                  <div
                    className="contact-item"
                    onClick={() => this.handleContactClick("email")}
                  >
                    <FaEnvelope className="contact-icon" />
                    <div className="contact-details">
                      <span className="contact-label">Email</span>
                      <span className="contact-value">bhcuonggg@gamil.com</span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <FaMapMarkerAlt className="contact-icon" />
                    <div className="contact-details">
                      <span className="contact-label">
                        <FormattedMessage
                          id="footer.contact-address"
                          defaultMessage="Địa chỉ"
                        />
                      </span>
                      <span className="contact-value">
                        <FormattedMessage
                          id="footer.address-value"
                          defaultMessage="61, Đường 783 Tạ Quang Bửu, Phường 4, Quận 8, TP.HCM"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <FaClock className="contact-icon" />
                    <div className="contact-details">
                      <span className="contact-label">
                        <FormattedMessage
                          id="footer.contact-hours"
                          defaultMessage="Giờ làm việc"
                        />
                      </span>
                      <span className="contact-value">
                        <FormattedMessage
                          id="footer.hours-value"
                          defaultMessage="24/7 - Tất cả các ngày"
                        />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="social-media">
                  <h4>
                    <FormattedMessage
                      id="footer.social-title"
                      defaultMessage="Theo dõi chúng tôi"
                    />
                  </h4>
                  <div className="social-icons">
                    <div className="social-icon facebook">
                      <FaFacebookF />
                    </div>
                    <div className="social-icon twitter">
                      <FaTwitter />
                    </div>
                    <div className="social-icon linkedin">
                      <FaLinkedinIn />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
              <div className="footer-bottom-content">
                <div className="copyright">
                  <FormattedMessage
                    id="footer.copyright"
                    defaultMessage="© 2024 Healthcare Platform. Tất cả quyền được bảo lưu."
                  />
                </div>
                <div className="footer-links">
                  <span>
                    <FormattedMessage
                      id="footer.link-privacy"
                      defaultMessage="Chính sách bảo mật"
                    />
                  </span>
                  <span>
                    <FormattedMessage
                      id="footer.link-terms"
                      defaultMessage="Điều khoản sử dụng"
                    />
                  </span>
                  <span>
                    <FormattedMessage
                      id="footer.link-cookies"
                      defaultMessage="Chính sách Cookies"
                    />
                  </span>
                </div>
                <div className="back-to-top" onClick={this.handleScrollToTop}>
                  <FormattedMessage
                    id="footer.back-to-top"
                    defaultMessage="Về đầu trang"
                  />
                  <i className="fas fa-arrow-up"></i>
                </div>
              </div>
            </div>
          </div>
        </footer>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
