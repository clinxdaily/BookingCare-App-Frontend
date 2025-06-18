import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./CustomerFeedback.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

// Import avatar images
import avatarNhan from "../../../assets/CustomerFeedback/d86082a5-b561-4904-a6c5-0122d8965ba9-nhan-nguyen.webp";
import avatarVy from "../../../assets/CustomerFeedback/3126ceaa-54ae-4916-a2a0-9d83d45b5561-mai-vy.webp";
import avatarTra from "../../../assets/CustomerFeedback/c76c323f-452f-4675-81b1-2c6fcd56e6a0-moc-tra.webp";
import avatarNhien from "../../../assets/CustomerFeedback/56dec824-744d-4f4a-b4ab-4aa7b0efaef4-an-nhien-nguyen.webp";
import avatarTrang from "../../../assets/CustomerFeedback/0df3e1b9-bff7-4b32-bca0-be4634aa5fc8-trang-pham-nguyen.webp";
import avatarSon from "../../../assets/CustomerFeedback/d868db0b-201c-4aff-968d-3623e48904ae-hai-son.webp";

class CustomerFeedback extends Component {
  render() {
    let settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      arrows: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
          },
        },
      ],
    };

    const feedbacks = [
      {
        id: 1,
        content:
          "Đặt lịch xét nghiệm rất tiện lợi, có ngay giờ cụ thể. An tâm đặt cho gia đình, có cả xét nghiệm tận nhà.",
        customerName: "Nhân Nguyễn",
        avatar: avatarNhan,
        rating: 5,
        location: "TP. Hồ Chí Minh",
      },
      {
        id: 2,
        content:
          "Dịch vụ tư vấn bác sĩ qua video rất tiện. Bác sĩ tư vấn chi tiết, nhẹ nhàng. Thực sự đáng tiền.",
        customerName: "Mai Vy",
        avatar: avatarVy,
        rating: 5,
        location: "Hà Nội",
      },
      {
        id: 3,
        content:
          "Dịch vụ dễ sử dụng và tiện lợi. Đặt trước có chọn ngày giờ thì khỏi xếp hàng đợi ở bệnh viện.",
        customerName: "Mộc Trà",
        avatar: avatarTra,
        rating: 5,
        location: "TP. Hồ Chí Minh",
      },
      {
        id: 4,
        content:
          "Tiện lợi, giao diện dễ sử dụng. Dịch vụ khám tại nhà rất phù hợp với người cao tuổi.",
        customerName: "An Nhiên Nguyễn",
        avatar: avatarNhien,
        rating: 5,
        location: "Bình Dương",
      },
      {
        id: 5,
        content:
          "Tôi ở xa nên mỗi lần khám rất mệt mỏi. Nhờ có HealthCare mà tôi có thể đặt lịch khám từ xa, rất tiện lợi.",
        customerName: "Trang Phạm Nguyễn",
        avatar: avatarTrang,
        rating: 5,
        location: "Bình Dương",
      },
      {
        id: 6,
        content:
          "Dịch vụ tư vấn rất tận tâm. Có hỗ trợ đặt nhầm giờ khám, rất hài lòng.",
        customerName: "Hải Sơn",
        avatar: avatarSon,
        rating: 5,
        location: "Bình Dương",
      },
    ];

    return (
      <div className="section-customer-feedback">
        <div className="feedback-content">
          <div className="section-header">
            <div className="section-title">
              <h2>
                <FormattedMessage
                  id="homepage.customer-feedback"
                  defaultMessage="Cảm nhận từ khách hàng"
                />
              </h2>
            </div>
            <div className="section-description">
              <FormattedMessage
                id="homepage.customer-feedback-description"
                defaultMessage="Những chia sẻ chân thực từ khách hàng."
              />
            </div>
          </div>

          <Slider {...settings}>
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="feedback-slide">
                <div className="feedback-card">
                  <div className="quote-icon">
                    <FaQuoteLeft />
                  </div>

                  <div className="feedback-content-text">
                    <p>"{feedback.content}"</p>
                  </div>

                  <div className="rating">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={
                          index < feedback.rating ? "star-filled" : "star-empty"
                        }
                      />
                    ))}
                  </div>

                  <div className="customer-info">
                    <div className="customer-avatar">
                      <img src={feedback.avatar} alt={feedback.customerName} />
                    </div>
                    <div className="customer-details">
                      <h4 className="customer-name">{feedback.customerName}</h4>
                      <p className="customer-location">{feedback.location}</p>
                    </div>
                  </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerFeedback);
