import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./MedicalFacility.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllClinic } from "../../../services/userService";
import { withRouter } from "react-router";
class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = { dataClinic: [] };
  }
  async componentDidMount() {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        dataClinic: res.data ? res.data : [],
      });
    }
  }
  handleViewClinic = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${clinic.id}`);
    }
  };
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

    // const renderStars = (rating) => {
    //   const stars = [];
    //   const fullStars = Math.floor(rating);
    //   const hasHalfStar = rating % 1 !== 0;

    //   for (let i = 0; i < fullStars; i++) {
    //     stars.push(
    //       <span key={i} className="star full">
    //         ★
    //       </span>
    //     );
    //   }

    //   if (hasHalfStar) {
    //     stars.push(
    //       <span key="half" className="star half">
    //         ★
    //       </span>
    //     );
    //   }

    //   const emptyStars = 5 - Math.ceil(rating);
    //   for (let i = 0; i < emptyStars; i++) {
    //     stars.push(
    //       <span key={`empty-${i}`} className="star empty">
    //         ★
    //       </span>
    //     );
    //   }

    //   return stars;
    // };
    let { dataClinic } = this.state;
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
            {dataClinic &&
              dataClinic.length > 0 &&
              dataClinic.map((item, index) => {
                return (
                  <div
                    className="facility-customize"
                    key={index}
                    onClick={() => this.handleViewClinic(item)}
                  >
                    <div className={`facility-image ${item.className}`}>
                      {item.image && <img src={item.image} />}
                    </div>
                    <div className="facility-info">
                      <h3>{item.name}</h3>
                      <div className="facility-location">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{item.address}</span>
                      </div>
                      {/* <div className="facility-rating">
                        <span className="rating-score">({item.rating})</span>
                        <div className="stars">{renderStars(item.rating)}</div>
                      </div> */}
                      <button className="book-appointment-btn">
                        <FormattedMessage
                          id="homepage.book-appointment"
                          defaultMessage="Đặt khám ngay"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MedicalFacility)
);
