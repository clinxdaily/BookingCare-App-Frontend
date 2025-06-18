import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./AboutSocial.scss";

// Import logo từ assets
import thanhNien from "../../../assets/NewsLogo/thanh-nien-logo.webp";
import tuoiTre from "../../../assets/NewsLogo/tuoi-tre-logo.webp";
import danTri from "../../../assets/NewsLogo/dan-tri.webp";
import nguoiLaoDong from "../../../assets/NewsLogo/nguoi-lao-dong-logo.webp";
import htv from "../../../assets/NewsLogo/htv.webp";
import vtv1 from "../../../assets/NewsLogo/vtv1-logo.webp";
import thvl from "../../../assets/NewsLogo/thvl-logo.webp";

class AboutSocial extends Component {
  render() {
    return (
      <div className="section-media-coverage">
        <div className="section-header">
          <div className="section-title">
            <h2>
              <FormattedMessage
                id="homepage.customer-feedback"
                defaultMessage="TRUYỀN THÔNG NÓI GÌ VỀ HEALTHCARE"
              />
            </h2>
          </div>
          <div className="section-description">
            <FormattedMessage
              id="homepage.customer-feedback-description"
              defaultMessage="Những lợi ích khám nhanh của HealthCare đã được ghi nhận rộng rãi."
            />
          </div>
        </div>

        <div className="logo-list">
          <img src={thanhNien} alt="Thanh Niên" />
          <img src={tuoiTre} alt="Tuổi Trẻ" />
          <img src={danTri} alt="Dân Trí" />
          <img src={nguoiLaoDong} alt="Người Lao Động" />
          <img src={htv} alt="HTV" />
          <img src={vtv1} alt="VTV1" />
          <img src={thvl} alt="THVL" />
        </div>

        <div className="video-wrapper">
          <iframe
            width="1047"
            height="438"
            src="https://www.youtube.com/embed/psZ1g9fMfeo?list=RD30KI5SuECuc"
            title="SƠN TÙNG M-TP | CHÚNG TA CỦA HIỆN TẠI | OFFICIAL MUSIC VIDEO"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(AboutSocial);
