import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./DoctorHighlight.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import { withRouter } from "react-router";

class DoctorHighlight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.topDoctors !== this.props.topDoctors) {
      console.log("Top Doctors Data:", this.props.topDoctors);
      this.setState({
        arrDoctors: this.props.topDoctors.data || [],
      });
    }
  }
  componentDidMount() {
    this.props.loadTopDoctors();
  }
  handleViewDetailDoctor = (doctor) => {
    console.log("View detail doctor:", doctor);
    this.props.history.push(`/detail-doctor/${doctor.id}`); // Redirect to the doctor's detail page
  };
  render() {
    console.log("DoctorHighlight component rendered", this.props.topDoctors);
    let arrDoctors = this.state.arrDoctors;
    let { language } = this.props;

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

    return (
      <div className="section-doctor-highlight">
        <div className="doctor-highlight-content">
          <div className="section-header">
            <div className="section-title">
              <h2>
                <FormattedMessage id="homepage.doctor-highlight" />
              </h2>
            </div>
            <div className="section-description">
              <FormattedMessage id="homepage.doctor-highlight-description" />
            </div>
            <a href="/doctors" className="view-more">
              <FormattedMessage id="homepage.more-info" />
            </a>
          </div>

          <Slider {...settings}>
            {arrDoctors &&
              arrDoctors.length > 0 &&
              arrDoctors.map((item, index) => {
                let imageBase64 = "";
                if (item.image) {
                  imageBase64 = new Buffer(item.image, "base64").toString(
                    "binary"
                  );
                }
                let nameVi = `${item.positionData?.valueVi}.  ${item.lastName} ${item.firstName}`;
                let nameEn = `${item.positionData?.valueEn}.  ${item.firstName} ${item.lastName}`;

                return (
                  <div
                    key={index}
                    className="doctor-customize"
                    onClick={() => this.handleViewDetailDoctor(item)}
                  >
                    <div
                      className="doctor-image"
                      // style={{ backgroundImage: `url(${imageBase64})` }}
                    >
                      <img src={imageBase64} alt="doctor" />
                    </div>

                    <div className="doctor-info">
                      <h3>{language === LANGUAGES.VI ? nameVi : nameEn}</h3>

                      <p className="doctor-address">
                        <i className="fas fa-map-marker-alt"></i> {item.address}
                      </p>

                      <p className="doctor-phone">
                        <i className="fas fa-phone-alt"></i> {item.phonenumber}
                      </p>
                      <div className="doctor-specialty"></div>

                      <button className="consult-now-btn">
                        <FormattedMessage id="homepage.consult" />
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
    topDoctors: state.admin.topDoctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DoctorHighlight)
);
