import React, { Component } from "react";
import { connect } from "react-redux";
import "./AllDoctor.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { getAllDoctor } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import { withRouter } from "react-router";

class AllDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }

  async componentDidMount() {
    try {
      let res = await getAllDoctor();
      if (res && res.errCode === 0) {
        this.setState({ arrDoctors: res.data || [] });
      }
    } catch (e) {
      console.error("Error loading doctors:", e);
    }
  }

  handleViewDetailDoctor = (doctor) => {
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
  };

  render() {
    const { arrDoctors } = this.state;
    const { language } = this.props;

    return (
      <>
        <HomeHeader />
        <div className="all-doctor-container">
          <div className="all-doctor-title">Danh sách tất cả bác sĩ</div>
          <div className="all-doctor-list">
            {arrDoctors &&
              arrDoctors.length > 0 &&
              arrDoctors.map((item, index) => {
                const imageSrc = item.image || "/assets/default-doctor.png";

                const nameVi = `${item.positionData?.valueVi || ""} ${
                  item.lastName
                } ${item.firstName}`;
                const nameEn = `${item.positionData?.valueEn || ""} ${
                  item.firstName
                } ${item.lastName}`;

                return (
                  <div
                    key={index}
                    className="doctor-card"
                    onClick={() => this.handleViewDetailDoctor(item)}
                  >
                    <div className="doctor-image">
                      <img src={imageSrc} alt={nameVi || "doctor"} />
                    </div>
                    <div className="doctor-info">
                      <h3>{language === LANGUAGES.VI ? nameVi : nameEn}</h3>
                      <p>
                        <i className="fas fa-map-marker-alt"></i>{" "}
                        {item.address || "Chưa cập nhật địa chỉ"}
                      </p>
                      <p>
                        <i className="fas fa-phone-alt"></i>{" "}
                        {item.phonenumber || "Chưa cập nhật"}
                      </p>
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

const mapStateToProps = (state) => ({
  language: state.app.language,
});

export default withRouter(connect(mapStateToProps)(AllDoctor));
