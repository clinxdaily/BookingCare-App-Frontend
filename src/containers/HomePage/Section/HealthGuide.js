import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./HealthGuide.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import images (you'll need to add these to your assets folder)
import imgNoiSoi from "../../../assets/HealthGuide/noisoi.webp";

class HealthGuide extends Component {
  render() {
    let settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
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

    const healthGuides = [
      {
        id: 1,
        title:
          "Nội soi da dày, đại tràng không đau tại Doctor Check có tốt không?",
        excerpt:
          "Bạn đang tìm kiếm địa chỉ nội soi da dày, đại tràng không đau? Tham khảo ngay Trung Tâm Nội Soi Tiêu Hóa Doctor Check trên Medpro!",
        image: imgNoiSoi,
        date: "07/05/2025",
        time: "12:18",
        author: "Uyển Nhi",
        category: "Tiêu hóa",
        className: "guide-1",
      },
      {
        id: 2,
        title: "Top 6 địa chỉ khám chữa bệnh zona thần kinh uy tín",
        excerpt:
          "Tìm hiểu về các địa chỉ uy tín để khám và điều trị bệnh zona thần kinh hiệu quả nhất tại TP.HCM.",
        image: imgNoiSoi,
        date: "09/06/2025",
        time: "10:22",
        author: "Tú Nguyễn",
        category: "Thần kinh",
        className: "guide-2",
      },
      {
        id: 3,
        title: "Bệnh tim mạch khám chữa ở đâu tốt nhất TPHCM?",
        excerpt:
          "Hướng dẫn tìm kiếm các bệnh viện và phòng khám tim mạch uy tín nhất tại TP.HCM cho việc khám và điều trị.",
        image: imgNoiSoi,
        date: "05/06/2025",
        time: "10:06",
        author: "Tú Nguyễn",
        category: "Tim mạch",
        className: "guide-3",
      },
      {
        id: 4,
        title: "Bệnh viêm hô hấp ở trẻ em: dấu hiệu và cách điều trị",
        excerpt:
          "Tìm hiểu về các triệu chứng, nguyên nhân và phương pháp điều trị bệnh viêm hô hấp ở trẻ em.",
        image: imgNoiSoi,
        date: "03/06/2025",
        time: "14:30",
        author: "BS. Đặng Xuân Khôi",
        category: "Nhi khoa",
        className: "guide-4",
      },
      {
        id: 5,
        title: "Bướu máu ở trẻ sơ sinh: từ nguyên nhân cho đến cách điều trị",
        excerpt:
          "Hướng dẫn chi tiết về bướu máu ở trẻ sơ sinh, nguyên nhân hình thành và các phương pháp điều trị hiện đại.",
        image: imgNoiSoi,
        date: "01/06/2025",
        time: "09:15",
        author: "BS. Đặng Xuân Khôi",
        category: "Nhi khoa",
        className: "guide-5",
      },
      {
        id: 6,
        title: "Phát hiện sớm và điều trị ung thư: Những điều cần biết",
        excerpt:
          "Tầm quan trọng của việc phát hiện sớm ung thư và các phương pháp điều trị tiên tiến nhất hiện nay.",
        image: imgNoiSoi,
        date: "28/05/2025",
        time: "16:45",
        author: "BS. Lê Minh Tâm",
        category: "Ung bướu",
        className: "guide-6",
      },
    ];

    return (
      <div className="section-health-guide">
        <div className="health-guide-content">
          <div className="section-header">
            <div className="section-title">
              <h2>
                <FormattedMessage
                  id="homepage.health-guide"
                  defaultMessage="Cẩm nang Y tế"
                />
              </h2>
            </div>
            <div className="section-description">
              <FormattedMessage
                id="homepage.health-guide-description"
                defaultMessage="Cập nhật những thông tin y tế mới nhất, hữu ích từ các chuyên gia hàng đầu."
              />
            </div>
            <a href="/health-guide" className="view-more">
              <FormattedMessage
                id="homepage.more-info"
                defaultMessage="Xem thêm"
              />
            </a>
          </div>

          <Slider {...settings}>
            {healthGuides.map((item) => (
              <div key={item.id} className="guide-customize">
                <div className="guide-card">
                  <div className={`guide-image ${item.className}`}>
                    {item.image && <img src={item.image} alt={item.title} />}
                    <div className="category-tag">{item.category}</div>
                  </div>
                  <div className="guide-info">
                    <h3 className="guide-title">{item.title}</h3>
                    <p className="guide-excerpt">{item.excerpt}</p>
                    <div className="guide-meta">
                      <span className="guide-date">
                        {item.date}, {item.time}
                      </span>
                      <span className="guide-author">- {item.author}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(HealthGuide);
