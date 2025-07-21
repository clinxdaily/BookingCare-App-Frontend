import React, { Component } from "react";
import { connect } from "react-redux";
import "./AllHandbook.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { getAllHandbooks } from "../../../services/userService";

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

  render() {
    const { arrHandbooks } = this.state;

    return (
      <>
        <HomeHeader />
        <div className="all-handbook-container">
          <div className="all-handbook-title">Danh sách tất cả cẩm nang</div>
          <div className="all-handbook-list">
            {arrHandbooks &&
              arrHandbooks.length > 0 &&
              arrHandbooks.map((item, index) => {
                let imageSrc = "/assets/default-handbook.png";
                if (item.image) {
                  imageSrc = item.image;
                }

                return (
                  <div key={index} className="handbook-card">
                    <div className="handbook-image">
                      <img src={imageSrc} alt="handbook" />
                    </div>
                    <div className="handbook-info">
                      <h3>{item.name}</h3>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <HomeFooter />
      </>
    );
  }
}

export default connect(null)(AllHandbook);
