import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import Specialty from "./Section/Specialty";
import MedicalFacility from "./Section/MedicalFacility";
import DoctorHighlight from "./Section/DoctorHighlight";
import HealthGuide from "./Section/HealthGuide";
import Statistics from "./Section/Statistics";
import CustomerFeedback from "./Section/CustomerFeedback";
import AboutSocial from "./Section/AboutSocial";
import HomeFooter from "./HomeFooter";
class HomePage extends Component {
  render() {
    return (
      <div>
        <HomeHeader isShowBanner={true} />
        <Specialty />
        <MedicalFacility />
        <DoctorHighlight />
        <HealthGuide />
        <CustomerFeedback />
        <Statistics />
        <AboutSocial />
        <HomeFooter />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
