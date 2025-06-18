import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./Specialty.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import imgXuongKhop from "../../../assets/specialty/xuong_khop_chinh_hinh.webp";
import imgThanKinh from "../../../assets/specialty/tam_than_kinh.webp";
import imgTieuHoa from "../../../assets/specialty/tieu_hoa.webp";
import imgTimMach from "../../../assets/specialty/tim_mach.webp";
import imgTaiMuiHong from "../../../assets/specialty/tai_mui_hong.webp";

class Specialty extends Component {
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

    const specialties = [
      {
        id: 1,
        name: "Cơ Xương khớp",
        image: imgXuongKhop, // Add actual image URL here
        className: "specialty-1",
      },
      {
        id: 2,
        name: "Thần kinh",
        image: imgThanKinh, // Add actual image URL here
        className: "specialty-2",
      },
      {
        id: 3,
        name: "Tiêu hóa",
        image: imgTieuHoa, // Add actual image URL here
        className: "specialty-3",
      },
      {
        id: 4,
        name: "Tim mạch",
        image: imgTimMach, // Add actual image URL here
        className: "specialty-4",
      },
      {
        id: 5,
        name: "Tai Mũi Họng",
        image: imgTaiMuiHong, // Add actual image URL here
        className: "specialty-5",
      },
      {
        id: 6,
        name: "Cột sống",
        image: imgXuongKhop, // Add actual image URL here
        className: "specialty-6",
      },
    ];

    return (
      <div className="section-specialty">
        <div className="specialty-content">
          <div className="section-header">
            <div className="section-title">
              <h2>
                <FormattedMessage
                  id="homepage.specialty"
                  defaultMessage="Chuyên khoa"
                />
              </h2>
            </div>
            <div className="section-description">
              <FormattedMessage
                id="homepage.specialty-description"
                defaultMessage="Chúng tôi cung cấp dịch vụ khám bệnh với các chuyên khoa hàng đầu."
              />
            </div>
            <a href="/specialty" className="view-more">
              <FormattedMessage
                id="homepage.more-info"
                defaultMessage="Xem thêm"
              />
            </a>
          </div>

          <Slider {...settings}>
            {specialties.map((item) => (
              <div key={item.id} className="img-customize">
                <div className={`specialty-image ${item.className}`}>
                  {item.image && <img src={item.image} alt={item.name} />}
                </div>
                <div className="specialty-info">
                  <h3>{item.name}</h3>
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

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
