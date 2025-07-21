import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { getAllSpecialties } from "../../../services/userService";
import "./AllSpecialty.scss";
import { withRouter } from "react-router";

class AllSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSpecialty: [],
    };
  }

  async componentDidMount() {
    let res = await getAllSpecialties();
    if (res && res.errCode === 0) {
      this.setState({
        dataSpecialty: res.data || [],
      });
    }
  }

  handleViewDetailSpecialty = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${item.id}`);
    }
  };

  render() {
    let { dataSpecialty } = this.state;
    return (
      <>
        <HomeHeader />
        <div className="all-specialty-container">
          <div className="title">Danh sách tất cả chuyên khoa</div>
          <div className="specialty-list">
            {dataSpecialty &&
              dataSpecialty.length > 0 &&
              dataSpecialty.map((item, index) => {
                return (
                  <div
                    className="specialty-item"
                    key={index}
                    onClick={() => this.handleViewDetailSpecialty(item)}
                  >
                    <div className="specialty-img">
                      {item.image && <img src={item.image} alt={item.name} />}
                    </div>
                    <div className="specialty-name">{item.name}</div>
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

export default withRouter(connect()(AllSpecialty));
