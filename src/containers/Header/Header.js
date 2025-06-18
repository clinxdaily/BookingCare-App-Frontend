import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu } from "./menuApp";
import "./Header.scss";
import { LANGUAGES } from "../../utils/constant";

class Header extends Component {
  handleChangeLanguage = (language) => {
    this.props.changeLanguageApp(language);
  };
  render() {
    const { processLogout, language, userInfo } = this.props;

    return (
      <div className="header-container">
        {/* thanh navigator */}
        <div className="header-tabs-container">
          <Navigator menus={adminMenu} />
        </div>
        <div className="languages">
          <span className="welcome">
            <FormattedMessage id="home-header.welcome" /> ,{" "}
            {userInfo && userInfo.firstName ? userInfo.firstName : ""}{" "}
            {userInfo && userInfo.lastName ? userInfo.lastName : ""}
          </span>
          <span
            className={
              language === LANGUAGES.VI ? "language-vi active" : "language-vi"
            }
            onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}
          >
            VN{" "}
            <img
              src="https://flagcdn.com/w40/vn.png"
              alt="Vietnam Flag"
              width="20"
            />
          </span>

          <span
            className={
              language === LANGUAGES.EN ? "language-en active" : "language-en"
            }
            onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}
          >
            EN{" "}
            <img
              src="https://flagcdn.com/w40/us.png"
              alt="English Flag"
              width="20"
            />
          </span>
        </div>
        {/* nút logout */}
        <div className="btn btn-logout" onClick={processLogout} title="Logout">
          <i className="fas fa-sign-out-alt"></i>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,

    userInfo: state.user.userInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
    changeLanguageApp: (language) =>
      dispatch(actions.changeLanguageApp(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
