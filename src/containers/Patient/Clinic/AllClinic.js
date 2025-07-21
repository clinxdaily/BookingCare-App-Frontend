import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { getAllClinic } from "../../../services/userService";
import "./AllClinic.scss";
import { withRouter } from "react-router";

class AllClinic extends Component {
  state = {
    clinics: [],
  };

  async componentDidMount() {
    let res = await getAllClinic();
    console.log("check res get all clinic: ", res);
    if (res && res.errCode === 0) {
      this.setState({
        clinics: res.data || [],
      });
    }
  }

  handleViewDetailClinic = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${item.id}`);
    }
  };

  render() {
    const { clinics } = this.state;
    return (
      <>
        <HomeHeader />
        <div className="all-clinic-container">
          <div className="title">Danh sách tất cả cơ sở y tế</div>
          <div className="clinic-list">
            {clinics && clinics.length > 0 ? (
              clinics.map((item, idx) => (
                <div
                  key={idx}
                  className="clinic-item"
                  onClick={() => this.handleViewDetailClinic(item)}
                >
                  <div className="clinic-img">
                    {item.image && <img src={item.image} alt={item.name} />}
                  </div>
                  <div className="clinic-name">{item.name}</div>
                  {item.address && (
                    <div className="clinic-address">{item.address}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-data">Không có dữ liệu cơ sở y tế</div>
            )}
          </div>
        </div>
        <HomeFooter />
      </>
    );
  }
}

export default withRouter(connect()(AllClinic));
