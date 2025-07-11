import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import Slider from "react-slick";
import { getAllSpecialties } from "../../../services/userService";
import "./Specialty.scss";
import { withRouter } from "react-router";
class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSpecialty: [],
    };
  }

  async componentDidMount() {
    let res = await getAllSpecialties();
    console.log("check res specialty: ", res);
    if (res && res.errCode === 0) {
      this.setState({
        dataSpecialty: res.data ? res.data : [],
      });
    }
  }
  handleViewDetailSpecialty = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${item.id}`);
    }
  };
  render() {
    const settings = {
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
    const { dataSpecialty } = this.state;
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
            {dataSpecialty &&
              dataSpecialty.length > 0 &&
              dataSpecialty.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="img-customize"
                    onClick={() => this.handleViewDetailSpecialty(item)}
                  >
                    <div className="specialty-image">
                      {item.image && <img src={item.image} alt="doctor" />}
                    </div>
                    <div className="specialty-info">
                      <h3>{item.name}</h3>
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

export default withRouter(connect(mapStateToProps)(Specialty));
