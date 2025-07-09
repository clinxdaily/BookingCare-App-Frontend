import React, { Component } from "react";
import { connect } from "react-redux";
import { LANGUAGES } from "../../../utils";
import "./ProfileDoctor.scss";
import { getProfileDoctorById } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import { classNames } from "react-select/dist/index-ea9e225d.cjs.prod";
import NumberFormat from "react-number-format";
import _ from "lodash";
import moment from "moment";
class ProfileDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = { dataProfile: [] };
  }
  async componentDidMount() {
    console.log("componentDidMount - doctorId:", this.props.doctorId);
    let data = await this.getInfoDoctor(this.props.doctorId);
    this.setState({
      dataProfile: data,
    });
  }
  getInfoDoctor = async (id) => {
    let result = {};
    if (id) {
      let res = await getProfileDoctorById(id);
      console.log("res data: ", res);
      if (res && res.errCode === 0) {
        result = res.data;
      }
    }
    return result;
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.doctorId !== prevProps.doctorId) {
      console.log(
        "componentDidUpdate - doctorId changed:",
        this.props.doctorId
      );
      this.getInfoDoctor(this.props.doctorId);
    }
  }
  renderTimeBooking = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment
              .unix(+dataTime.date / 1000)
              .locale("en")
              .format("ddd - MM/DD/YYYY");
      return (
        <>
          <div>
            Thời gian khám: {time} - {date}
          </div>
          <div>Miễn phí đặt lịch</div>
        </>
      );
    }
    return <></>;
  };
  render() {
    let { dataProfile } = this.state;
    let { language, isShowIntro, dataTime } = this.props;
    let nameVi = "";
    let nameEn = "";
    if (dataProfile && dataProfile.positionData) {
      nameVi = `${dataProfile.positionData?.valueVi}.  ${dataProfile.lastName} ${dataProfile.firstName}`;
      nameEn = `${dataProfile.positionData?.valueEn}.  ${dataProfile.firstName} ${dataProfile.lastName}`;
    }
    return (
      <React.Fragment>
        <div className="intro-doctor">
          <div
            className="content-left"
            style={{ backgroundImage: `url(${dataProfile.image})` }}
          ></div>

          <div className="content-right">
            <div className="content-up">
              {language === LANGUAGES.VI ? nameVi : nameEn}
            </div>
            <div className="content-down">
              {isShowIntro === true ? (
                <>
                  {dataProfile &&
                    dataProfile.Markdown &&
                    dataProfile.Markdown.description && (
                      <span>{dataProfile.Markdown.description}</span>
                    )}
                </>
              ) : (
                <>{this.renderTimeBooking(dataTime)}</>
              )}
            </div>
          </div>
        </div>
        <div className="price">
          Giá khám:{" "}
          {dataProfile &&
          dataProfile.Doctor_Info &&
          language === LANGUAGES.VI ? (
            <NumberFormat
              value={dataProfile.Doctor_Info.priceTypeData.valueVi}
              displayType={"text"}
              thousandSeparator={true}
              suffix={" VND"}
              style={{ textDecoration: "none" }}
            />
          ) : (
            ""
          )}
          {dataProfile &&
          dataProfile.Doctor_Info &&
          language === LANGUAGES.EN ? (
            <NumberFormat
              value={dataProfile.Doctor_Info.priceTypeData.valueEn}
              displayType={"text"}
              thousandSeparator={true}
              suffix={" $"}
              style={{ textDecoration: "none" }}
            />
          ) : (
            ""
          )}
        </div>
      </React.Fragment>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
