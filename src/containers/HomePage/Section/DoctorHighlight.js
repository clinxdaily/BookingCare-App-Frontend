import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./DoctorHighlight.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Import doctor images
import imgDoctor1 from "../../../assets/DoctorHighlight/lengochonghanh.webp";
import imgDoctor2 from "../../../assets/DoctorHighlight/tranthioanh.webp";
import imgDoctor3 from "../../../assets/DoctorHighlight/nguyenphucthien.webp";
import imgDoctor4 from "../../../assets/DoctorHighlight/lehoangainhi.webp";
import imgDoctor5 from "../../../assets/DoctorHighlight/hoangthianhthu.webp";
import imgDoctor6 from "../../../assets/DoctorHighlight/vidinhkhoi.webp";

class DoctorHighlight extends Component {
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

    const doctors = [
      {
        id: 1,
        name: "BS CKI. Lê Ngọc Hồng Hạnh",
        specialty: "Nhi - Thần kinh",
        rating: 4.8,
        reviews: 58,
        image: imgDoctor1,
        className: "doctor-1",
        title: "Bác sĩ Chuyên Khoa",
      },
      {
        id: 2,
        name: "Bác sĩ Trần Thị Oanh",
        specialty: "Sản khoa",
        rating: 4.7,
        reviews: 142,
        image: imgDoctor2,
        className: "doctor-2",
        title: "Bác sĩ Chuyên Khoa",
      },
      {
        id: 3,
        name: "BS CKI. Nguyễn Phúc Thiện",
        specialty: "Tim mạch",
        rating: 4.9,
        reviews: 89,
        image: imgDoctor3,
        className: "doctor-3",
        title: "Bác sĩ Chuyên Khoa",
      },
      {
        id: 4,
        name: "Bác sĩ Lê Hoàng Ái Nhi",
        specialty: "Nhi Khoa",
        rating: 4.6,
        reviews: 76,
        image: imgDoctor4,
        className: "doctor-4",
        title: "Bác sĩ Chuyên Khoa",
      },
      {
        id: 5,
        name: "Bác sĩ Hoàng Thị Anh Thư",
        specialty: "Tâm lý",
        rating: 4.8,
        reviews: 103,
        image: imgDoctor5,
        className: "doctor-5",
        title: "Bác sĩ Chuyên Khoa",
      },
      {
        id: 6,
        name: "Bác sĩ Vũ Đình Khôi",
        specialty: "Bệnh truyền nhiễm xã hội",
        rating: 4.8,
        reviews: 103,
        image: imgDoctor6,
        className: "doctor-5",
        title: "Bác sĩ Chuyên Khoa",
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
      <div className="section-doctor-highlight">
        <div className="doctor-highlight-content">
          <div className="section-header">
            <div className="section-title">
              <h2>
                <FormattedMessage
                  id="homepage.doctor-highlight"
                  defaultMessage="Bác sĩ nổi bật"
                />
              </h2>
            </div>
            <div className="section-description">
              <FormattedMessage
                id="homepage.doctor-highlight-description"
                defaultMessage="Đội ngũ bác sĩ giàu kinh nghiệm và chuyên môn cao được bệnh nhân tin tưởng."
              />
            </div>
            <a href="/doctors" className="view-more">
              <FormattedMessage
                id="homepage.more-info"
                defaultMessage="Xem thêm"
              />
            </a>
          </div>

          <Slider {...settings}>
            {doctors.map((doctor) => (
              <div key={doctor.id} className="doctor-customize">
                <div className={`doctor-image ${doctor.className}`}>
                  {doctor.image && <img src={doctor.image} alt={doctor.name} />}
                </div>
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <div className="doctor-specialty">
                    <i className="fas fa-stethoscope"></i>
                    <span>{doctor.specialty}</span>
                  </div>
                  <div className="doctor-title">
                    <i className="fas fa-user-md"></i>
                    <span>{doctor.title}</span>
                  </div>
                  <div className="doctor-rating">
                    <div className="stars">{renderStars(doctor.rating)}</div>
                    <span className="rating-info">
                      {doctor.rating} ({doctor.reviews}{" "}
                      <FormattedMessage
                        id="homepage.reviews"
                        defaultMessage="lượt khám"
                      />
                      )
                    </span>
                  </div>
                  <button className="consult-now-btn">
                    <FormattedMessage
                      id="homepage.consult-now"
                      defaultMessage="Tư vấn ngay"
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorHighlight);
