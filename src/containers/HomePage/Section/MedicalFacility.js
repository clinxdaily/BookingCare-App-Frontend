import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./MedicalFacility.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import imgNoiSoi from "../../../assets/MedicalFacility/bv_noisoi.webp";
import imgDaLieu from "../../../assets/MedicalFacility/dalieu.webp";
import imgYDuoc from "../../../assets/MedicalFacility/yhoc.png";
import imgMat from "../../../assets/MedicalFacility/bv_mat.webp";
import imgNhiDong1 from "../../../assets/MedicalFacility/bv_nhidong1.webp";

class MedicalFacility extends Component {
  render() {
    let settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 2,
      arrows: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: false,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
          },
        },
      ],
    };

    const medicalFacilities = [
      {
        id: 1,
        name: "Trung Tâm Nội Soi Tiêu Hóa Doctor Check",
        location: "Quận 10, TP. Hồ Chí Minh",
        rating: 4.5,
        image: imgNoiSoi,
        className: "facility-1",
      },
      {
        id: 2,
        name: "Bệnh viện Da Liễu TP. Hồ Chí Minh",
        location: "Quận 3, TP. Hồ Chí Minh",
        rating: 4.3,
        image: imgDaLieu,
        className: "facility-2",
      },
      {
        id: 3,
        name: "Bệnh viện Đại học Y Dược TP. Hồ Chí Minh",
        location: "Hồng Bàng, Quận 5, TP. Hồ Chí Minh",
        rating: 4.4,
        image: imgYDuoc,
        className: "facility-3",
      },
      {
        id: 4,
        name: "Bệnh viện Mắt",
        location: "Quận 3, TP. Hồ Chí Minh",
        rating: 4.2,
        image: imgMat,
        className: "facility-4",
      },
      {
        id: 5,
        name: "Bệnh viện Nhi Đồng 1",
        location: "Quận 10, TP. Hồ Chí Minh",
        rating: 4.6,
        image: imgNhiDong1,
        className: "facility-5",
      },
    ];

    const renderStars = (rating) => {
      const stars = [];
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 !== 0;

      for (let i = 0; i < fullStars; i++) {
        stars.push(
          <span key={i} className="star full">
            ★
          </span>
        );
      }

      if (hasHalfStar) {
        stars.push(
          <span key="half" className="star half">
            ★
          </span>
        );
      }

      const emptyStars = 5 - Math.ceil(rating);
      for (let i = 0; i < emptyStars; i++) {
        stars.push(
          <span key={`empty-${i}`} className="star empty">
            ★
          </span>
        );
      }

      return stars;
    };

    return (
      <div className="section-medical-facility">
        <div className="medical-facility-content">
          <div className="section-header">
            <div className="section-title">
              <h2>
                <FormattedMessage
                  id="homepage.medical-facility"
                  defaultMessage="Cơ sở y tế nổi bật"
                />
              </h2>
            </div>
            <div className="section-description">
              <FormattedMessage
                id="homepage.medical-facility-description"
                defaultMessage="Các bệnh viện và phòng khám uy tín với đội ngũ bác sĩ chuyên nghiệp."
              />
            </div>
            <a href="/medical-facility" className="view-more">
              <FormattedMessage
                id="homepage.more-info"
                defaultMessage="Xem thêm"
              />
            </a>
          </div>

          <Slider {...settings}>
            {medicalFacilities.map((item) => (
              <div key={item.id} className="facility-customize">
                <div className={`facility-image ${item.className}`}>
                  {item.image && <img src={item.image} alt={item.name} />}
                </div>
                <div className="facility-info">
                  <h3>{item.name}</h3>
                  <div className="facility-location">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{item.location}</span>
                  </div>
                  <div className="facility-rating">
                    <span className="rating-score">({item.rating})</span>
                    <div className="stars">{renderStars(item.rating)}</div>
                  </div>
                  <button className="book-appointment-btn">
                    <FormattedMessage
                      id="homepage.book-appointment"
                      defaultMessage="Đặt khám ngay"
                    />
                  </button>
                </div>
              </div>
            ))}
          </Slider>
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

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);
