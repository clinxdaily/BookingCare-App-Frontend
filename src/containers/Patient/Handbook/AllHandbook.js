import React, { Component } from "react";
import { connect } from "react-redux";
import "./AllHandbook.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { getAllHandbooks } from "../../../services/userService";
import { withRouter } from "react-router";

class AllHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrHandbooks: [],
    };
  }

  async componentDidMount() {
    let res = await getAllHandbooks();
    if (res && res.errCode === 0) {
      this.setState({
        arrHandbooks: res.data || [],
      });
    }
  }

  handleViewDetailHandbook = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/${item.id}`);
    }
  };

  render() {
    const { arrHandbooks } = this.state;

    return (
      <>
        <HomeHeader />
        <div className="all-handbook-container">
          <div className="all-handbook-title">Danh sách tất cả cẩm nang</div>
          <div className="all-handbook-list">
            {arrHandbooks && arrHandbooks.length > 0 ? (
              arrHandbooks.map((item, index) => {
                let imageSrc = "/assets/default-handbook.png";
                if (item.image) {
                  imageSrc = item.image;
                }

                return (
                  <div
                    key={index}
                    className="handbook-card"
                    onClick={() => this.handleViewDetailHandbook(item)}
                  >
                    <div className="handbook-image">
                      <img src={imageSrc} alt="handbook" />
                    </div>
                    <div className="handbook-info">
                      <h3>{item.name}</h3>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-data">Không có dữ liệu cẩm nang</div>
            )}
          </div>
        </div>
        <HomeFooter />
      </>
    );
  }
}

export default withRouter(connect()(AllHandbook));
