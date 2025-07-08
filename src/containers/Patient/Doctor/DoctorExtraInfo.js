import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorExtraInfo.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import { getExtraInfoDoctorById } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import NumberFormat from "react-number-format";
import { lang } from "moment";
import { FormattedMessage } from "react-intl";
class DoctorExtraInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { isShowDetailInfo: false, extraInfo: {} };
  }
  async componentDidMount() {}
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let res = await getExtraInfoDoctorById(this.props.doctorIdFromParent);
      if (res && res.errCode === 0) {
        this.setState({
          extraInfo: res.data,
        });
      }
    }
  }
  showHideDetailInfo = (status) => {
    this.setState({
      isShowDetailInfo: status,
    });
  };
  render() {
    let { isShowDetailInfo, extraInfo } = this.state;
    let { language } = this.props;
    {
      return (
        <React.Fragment>
          <div className="doctor-extra-info-container">
            <div className="content-up">
              <div className="text-address">
                <i class="fas fa-map-marker-alt"></i>{" "}
                <FormattedMessage id="doctor-extra.address" />
              </div>
              <div className="name-clinic">
                {extraInfo && extraInfo.nameClinic ? extraInfo.nameClinic : ""}
              </div>
              <div className="detail-address">
                {extraInfo && extraInfo.addressClinic
                  ? extraInfo.addressClinic
                  : ""}
              </div>
            </div>
            <hr className="line-between" />
            <div className="content-down">
              <div className="text-price">
                <i class="fas fa-money-bill-wave-alt"></i>{" "}
                <FormattedMessage id="doctor-extra.price" />{" "}
                {extraInfo &&
                  extraInfo.priceTypeData &&
                  language === LANGUAGES.VI && (
                    <NumberFormat
                      value={extraInfo.priceTypeData.valueVi}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix={" VND"}
                      style={{ textDecoration: "none" }}
                    />
                  )}
                {extraInfo &&
                  extraInfo.priceTypeData &&
                  language === LANGUAGES.EN && (
                    <NumberFormat
                      value={extraInfo.priceTypeData.valueEn}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix={" $"}
                      style={{ textDecoration: "none" }}
                    />
                  )}
                {isShowDetailInfo === false && (
                  <div>
                    <span onClick={() => this.showHideDetailInfo(true)}>
                      <FormattedMessage id="doctor-extra.more" />
                    </span>
                  </div>
                )}
              </div>

              {isShowDetailInfo === true && (
                <>
                  <div>{extraInfo && extraInfo.note ? extraInfo.note : ""}</div>
                  <div>
                    <FormattedMessage id="doctor-extra.payment" />{" "}
                    {extraInfo &&
                    extraInfo.paymentTypeData &&
                    language === LANGUAGES.VI
                      ? extraInfo.paymentTypeData.valueVi
                      : extraInfo.paymentTypeData.valueEn}
                  </div>
                  <span onClick={() => this.showHideDetailInfo(false)}>
                    <FormattedMessage id="doctor-extra.hide" />
                  </span>
                </>
              )}
            </div>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);
