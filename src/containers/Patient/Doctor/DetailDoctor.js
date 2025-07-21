import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailDoctor.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { getDetailInFoDoctor } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtraInfo from "./DoctorExtraInfo";
class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = { detailDoctor: {}, currentDoctorId: -1 };
  }
  async componentDidMount() {
    window.scrollTo(0, 0);
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      this.setState({
        currentDoctorId: this.props.match.params.id,
      });
      let res = await getDetailInFoDoctor(this.props.match.params.id);
      console.log("Check res from doctor detail: ", res);
      if (res && res.errCode === 0) {
        this.setState({
          detailDoctor: res.data,
        });
      }
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {}
  render() {
    {
      console.log("Check state from DetailDoctor: ", this.state);
      let { detailDoctor } = this.state;
      let { language } = this.props;
      let nameVi = "";
      let nameEn = "";
      if (detailDoctor && detailDoctor.positionData) {
        nameVi = `${detailDoctor.positionData?.valueVi}.  ${detailDoctor.lastName} ${detailDoctor.firstName}`;
        nameEn = `${detailDoctor.positionData?.valueEn}.  ${detailDoctor.firstName} ${detailDoctor.lastName}`;
      }

      return (
        <React.Fragment>
          <HomeHeader isShowBanner={false} />
          <div className="doctor-detail-container">
            <div className="intro-doctor">
              <div
                className="content-left"
                style={{ backgroundImage: `url(${detailDoctor.image})` }}
              ></div>
              <div className="content-right">
                <div className="content-up">
                  {language === LANGUAGES.VI ? nameVi : nameEn}
                </div>
                <div className="content-down">
                  {detailDoctor &&
                    detailDoctor.Markdown &&
                    detailDoctor.Markdown.description && (
                      <span>{detailDoctor.Markdown.description}</span>
                    )}
                </div>
              </div>
            </div>
            <div className="doctor-schedule">
              <div className="content-left">
                <DoctorSchedule
                  doctorIdFromParent={this.state.currentDoctorId}
                />
              </div>
              <div className="content-right">
                <DoctorExtraInfo
                  doctorIdFromParent={this.state.currentDoctorId}
                />
              </div>
            </div>
            <div className="detail-doctor-info">
              {detailDoctor && detailDoctor.Markdown && (
                <div
                  className="detail-doctor-info-text"
                  dangerouslySetInnerHTML={{
                    __html: detailDoctor.Markdown.contentHTML,
                  }}
                ></div>
              )}
            </div>

            <div className="comment-doctor">
              {/* Comments section can be added here */}
            </div>
          </div>
          <HomeFooter />
        </React.Fragment>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
