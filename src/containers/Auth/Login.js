import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import { FormattedMessage } from "react-intl";
import { handleLoginApi } from "../../services/userService";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isShowPassword: false,
      errMessage: "",
    };
  }

  handelOnChangeUsername = (event) => {
    this.setState({
      username: event.target.value,
    });
  };

  handelOnChangePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  handleLogin = async () => {
    this.setState({
      errMessage: "",
    });
    try {
      let data = await handleLoginApi(this.state.username, this.state.password);
      if (data && data.errCode !== 0) {
        this.setState({
          errMessage: data.message,
        });
      }
      if (data && data.errCode === 0) {
        this.props.userLoginSuccess(data.user);
        console.log("login success: ", data);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        this.setState({
          errMessage: error.response.data.message,
        });
      }
      console.log("error: ", error.message);
    }
  };

  handleShowHidePassword = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };

  render() {
    return (
      <div className="login-background">
        <div className="login-container">
          <div className="login-content">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your account</p>
            </div>

            <div className="form-group">
              <label>Username</label>
              <div className="input-container">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={this.state.username}
                  onChange={(event) => {
                    this.handelOnChangeUsername(event);
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-container password-container">
                <i className="fas fa-lock"></i>
                <input
                  type={this.state.isShowPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={(event) => {
                    this.handelOnChangePassword(event);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      this.handleLogin();
                    }
                  }}
                />
                <span
                  onClick={() => {
                    this.handleShowHidePassword();
                  }}
                  className="toggle-password"
                >
                  <i
                    className={
                      this.state.isShowPassword
                        ? "fas fa-eye"
                        : "fas fa-eye-slash"
                    }
                  ></i>
                </span>
              </div>
            </div>

            {this.state.errMessage && (
              <div className="error-message">{this.state.errMessage}</div>
            )}

            <button
              className="btn-login"
              onClick={() => {
                this.handleLogin();
              }}
            >
              <i className="fas fa-sign-in-alt"></i>
              <span>Sign In</span>
            </button>

            <div className="login-options">
              <span className="forgot-password">Forgot your password?</span>
              <span className="create-account">Create account</span>
            </div>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            <div className="social-login">
              <div className="social-btn google">
                <i className="fab fa-google"></i>
                <span>Google</span>
              </div>
              <div className="social-btn facebook">
                <i className="fab fa-facebook-f"></i>
                <span>Facebook</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
