import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import Slider from "react-slick";
import { getAllHandbooks } from "../../../services/userService"; // API lấy cẩm nang
import "./HealthGuide.scss";
import { withRouter } from "react-router";

class Handbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataHandbook: [],
    };
  }

  async componentDidMount() {
    let res = await getAllHandbooks();
    if (res && res.errCode === 0) {
      this.setState({
        dataHandbook: res.data || [],
      });
    }
  }

  handleViewDetailHandbook = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/${item.id}`);
    }
  };

  render() {
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 2,
      arrows: true,
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        {
          breakpoint: 768,
          settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false },
        },
        {
          breakpoint: 480,
          settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false },
        },
      ],
    };

    const { dataHandbook } = this.state;

    return (
      <div className="section-handbook">
        <div className="handbook-content">
          <div className="section-header">
            <div className="section-title">
              <h2>
                <FormattedMessage
                  id="homepage.handbook"
                  defaultMessage="Cẩm nang"
                />
              </h2>
            </div>
            <div className="section-description">
              <FormattedMessage
                id="homepage.handbook-description"
                defaultMessage="Thông tin hữu ích về sức khỏe và chăm sóc y tế."
              />
            </div>
            <a href="/handbook" className="view-more">
              <FormattedMessage
                id="homepage.more-info"
                defaultMessage="Xem thêm"
              />
            </a>
          </div>

          <Slider {...settings}>
            {dataHandbook &&
              dataHandbook.length > 0 &&
              dataHandbook.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="img-customize"
                    onClick={() => this.handleViewDetailHandbook(item)}
                  >
                    <div className="handbook-image">
                      {item.image && <img src={item.image} alt="handbook" />}
                    </div>
                    <div className="handbook-info">
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

export default withRouter(connect(mapStateToProps)(Handbook));
