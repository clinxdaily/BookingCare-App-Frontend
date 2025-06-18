import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserRedux.scss";
import { getAllCodeService } from "../../../services/userService";
import { language, LANGUAGES } from "../../../utils";
import * as actions from "../../../store/actions";
class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = { genderArr: [] };
  }
  async componentDidMount() {
    this.props.getGenderStart();
    // try {
    //   let res = await getAllCodeService("gender");
    //   if (res && res.errCode === 0) {
    //     this.setState({
    //       genderArr: res.data,
    //     });
    //   }
    // } catch (error) {
    //   console.log("error: ", error );
    // }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.genderRedux !== this.props.genderRedux) {
      this.setState({
        genderArr: this.props.genderRedux,
      });
    }
  }
  render() {
    let genders = this.state.genderArr;
    let language = this.props.language;
    return (
      <div className="user-redux-container">
        <h2 className="title">Manage Users with Redux</h2>
        <div className="user-redux-body">
          <form className="user-form">
            <div>
              <FormattedMessage id="manage-user.add" />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>
                  <FormattedMessage id="manage-user.email" />
                </label>
                <input type="email" placeholder="Email" />
              </div>
              <div className="form-field">
                <label>
                  <FormattedMessage id="manage-user.password" />
                </label>
                <input type="password" placeholder="Password" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>
                  <FormattedMessage id="manage-user.first-name" />
                </label>
                <input type="text" placeholder="First name" />
              </div>

              <div className="form-field">
                <label>
                  <FormattedMessage id="manage-user.last-name" />
                </label>
                <input type="text" placeholder="Last name" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>
                  <FormattedMessage id="manage-user.address" />
                </label>
                <input type="text" placeholder="1234 St" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>
                  <FormattedMessage id="manage-user.phone-number" />
                </label>
                <input type="text" placeholder="123 4567 890" />
              </div>
              <div className="form-field">
                <label>
                  <FormattedMessage id="manage-user.gender" />
                </label>
                <select>
                  {genders &&
                    genders.length > 0 &&
                    genders.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="form-field">
                <label>
                  <FormattedMessage id="manage-user.position" />
                </label>
                <select>
                  <option>Choose...</option>
                  <option>...</option>
                </select>
              </div>
              <div className="form-field">
                <label>
                  <FormattedMessage id="manage-user.roleid" />
                </label>
                <select>
                  <option>Choose...</option>
                  <option>...</option>
                </select>
              </div>
              <div className="form-field">
                <label>
                  <FormattedMessage id="manage-user.image" />
                </label>
                <input type="file" />
              </div>
            </div>

            {/* <div className="form-checkbox">
              <input type="checkbox" id="gridCheck" />
              <label htmlFor="gridCheck">Save</label>
            </div> */}

            <button type="submit" className="btn-submit">
              <FormattedMessage id="manage-user.save" />
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    // processLogout: () => dispatch(actions.processLogout()),
    // changeLanguageApp: (language) =>
    //   dispatch(actions.changeLanguageApp(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
