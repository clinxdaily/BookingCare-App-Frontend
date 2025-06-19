import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "./UserRedux.scss";
import { LANGUAGES } from "../../../utils";
import * as actions from "../../../store/actions";

class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // option data
      genderArr: [],
      positionArr: [],
      roleArr: [],

      // image preview / light‑box
      previewImgURL: "",
      isOpen: false,

      // form fields
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      phonenumber: "",
      gender: "",
      position: "",
      role: "",
      image: "",

      // validate
      errorMessage: "",
    };
  }

  /* ---------------- FETCH ALL CODES ---------------- */
  componentDidMount() {
    this.props.getGenderStart();
    this.props.fetchPositionStart();
    this.props.fetchRoleStart();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.genderRedux !== this.props.genderRedux) {
      const genderArr = this.props.genderRedux;
      this.setState({ genderArr, gender: genderArr[0]?.keyMap || "" });
    }
    if (prevProps.positionRedux !== this.props.positionRedux) {
      const positionArr = this.props.positionRedux;
      this.setState({ positionArr, position: positionArr[0]?.keyMap || "" });
    }
    if (prevProps.roleRedux !== this.props.roleRedux) {
      const roleArr = this.props.roleRedux;
      this.setState({ roleArr, role: roleArr[0]?.keyMap || "" });
    }
  }

  /* ---------------- IMAGE HANDLER ---------------- */
  handleOnchangeImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      this.setState({ previewImgURL: objectUrl, image: file });
    }
  };

  openLightbox = () =>
    this.state.previewImgURL && this.setState({ isOpen: true });
  closeLightbox = () => this.setState({ isOpen: false });

  /* ---------------- GENERIC INPUT ---------------- */
  onChangeInput = (e, id) =>
    this.setState({ [id]: e.target.value, errorMessage: "" });

  /* ---------------- VALIDATE ---------------- */
  validate = () => {
    const { email, password, firstName, lastName, address, phonenumber } =
      this.state;

    // email regex basic check "x@y.z"
    if (!email.trim()) return "Email không được để trống.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email không hợp lệ.";

    if (!password.trim()) return "Mật khẩu không được để trống.";
    if (!firstName.trim()) return "Họ không được để trống.";
    if (!lastName.trim()) return "Tên không được để trống.";
    if (!address.trim()) return "Địa chỉ không được để trống.";

    if (!phonenumber.trim()) return "Số điện thoại không được để trống.";
    if (!/^\d{9,12}$/.test(phonenumber))
      return "Số điện thoại phải là số 9–12 ký tự.";

    return ""; // no error
  };

  /* ---------------- SAVE ---------------- */
  handleSaveUser = () => {
    let err = this.validate();
    if (err) {
      this.setState({ errorMessage: err }); // hiển thị lỗi dưới form
      console.log("Lỗi validate:", err); // log ra lỗi
      return;
    }
    this.props.createNewUser({
      email: this.state.email,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      address: this.state.address,
      phonenumber: this.state.phonenumber,
      gender: this.state.gender,
      positionId: this.state.position,
      roleId: this.state.role,
    });

    console.log("Saving user...", this.state);
  };

  /* ---------------- RENDER ---------------- */
  render() {
    const {
      genderArr,
      positionArr,
      roleArr,
      previewImgURL,
      isOpen,
      email,
      password,
      firstName,
      lastName,
      address,
      phonenumber,
      gender,
      position,
      role,
      errorMessage,
    } = this.state;

    const { language, isLoadingGender } = this.props;

    return (
      <div className="user-redux-container">
        {isOpen && (
          <Lightbox
            mainSrc={previewImgURL}
            onCloseRequest={this.closeLightbox}
          />
        )}

        <h2 className="title">Manage Users with Redux</h2>

        {isLoadingGender && (
          <div className="loading-gender">
            <div className="loading">Loading data...</div>
          </div>
        )}

        <form className="user-form" onSubmit={(e) => e.preventDefault()}>
          {/* email & password */}
          <div className="form-row">
            <div className="form-field">
              <label>
                <FormattedMessage id="manage-user.email" />
              </label>
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => this.onChangeInput(e, "email")}
              />
            </div>
            <div className="form-field">
              <label>
                <FormattedMessage id="manage-user.password" />
              </label>
              <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => this.onChangeInput(e, "password")}
              />
            </div>
          </div>

          {/* first & last name */}
          <div className="form-row">
            <div className="form-field">
              <label>
                <FormattedMessage id="manage-user.first-name" />
              </label>
              <input
                type="text"
                value={firstName}
                placeholder="First name"
                onChange={(e) => this.onChangeInput(e, "firstName")}
              />
            </div>
            <div className="form-field">
              <label>
                <FormattedMessage id="manage-user.last-name" />
              </label>
              <input
                type="text"
                value={lastName}
                placeholder="Last name"
                onChange={(e) => this.onChangeInput(e, "lastName")}
              />
            </div>
          </div>

          {/* address */}
          <div className="form-row">
            <div className="form-field full-width">
              <label>
                <FormattedMessage id="manage-user.address" />
              </label>
              <input
                type="text"
                value={address}
                placeholder="1234 St"
                onChange={(e) => this.onChangeInput(e, "address")}
              />
            </div>
          </div>

          {/* phone & selects */}
          <div className="form-row">
            <div className="form-field">
              <label>
                <FormattedMessage id="manage-user.phone-number" />
              </label>
              <input
                type="text"
                value={phonenumber}
                placeholder="0123456789"
                onChange={(e) => this.onChangeInput(e, "phonenumber")}
              />
            </div>

            <div className="form-field">
              <label>
                <FormattedMessage id="manage-user.gender" />
              </label>
              <select
                value={gender}
                onChange={(e) => this.onChangeInput(e, "gender")}
              >
                {genderArr.map((g) => (
                  <option key={g.keyMap} value={g.keyMap}>
                    {language === LANGUAGES.VI ? g.valueVi : g.valueEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>
                <FormattedMessage id="manage-user.position" />
              </label>
              <select
                value={position}
                onChange={(e) => this.onChangeInput(e, "position")}
              >
                {positionArr.map((p) => (
                  <option key={p.keyMap} value={p.keyMap}>
                    {language === LANGUAGES.VI ? p.valueVi : p.valueEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>
                <FormattedMessage id="manage-user.roleid" />
              </label>
              <select
                value={role}
                onChange={(e) => this.onChangeInput(e, "role")}
              >
                {roleArr.map((r) => (
                  <option key={r.keyMap} value={r.keyMap}>
                    {language === LANGUAGES.VI ? r.valueVi : r.valueEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>
                <FormattedMessage id="manage-user.image" />
              </label>
              <div className="preview-img-container">
                <input
                  id="previewImg"
                  type="file"
                  accept="image/*"
                  onChange={this.handleOnchangeImg}
                />
                <label htmlFor="previewImg" className="custom-file-upload">
                  Tải ảnh lên
                </label>
                {previewImgURL ? (
                  <div
                    className="preview-img clickable"
                    style={{ backgroundImage: `url(${previewImgURL})` }}
                    onClick={this.openLightbox}
                  />
                ) : (
                  <div className="preview-img placeholder">
                    <span>No image</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* error message on save */}
          {errorMessage && <div className="form-error">{errorMessage}</div>}

          <button
            type="button"
            className="btn-submit"
            onClick={this.handleSaveUser}
          >
            <FormattedMessage id="manage-user.save" />
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
  genderRedux: state.admin.genders,
  positionRedux: state.admin.positions,
  roleRedux: state.admin.roles,
  isLoadingGender: state.admin.isLoadingGender,
});

const mapDispatchToProps = (dispatch) => ({
  getGenderStart: () => dispatch(actions.fetchGenderStart()),
  fetchPositionStart: () => dispatch(actions.fetchPositionStart()),
  fetchRoleStart: () => dispatch(actions.fetchRoleStart()),
  createNewUser: (data) => dispatch(actions.createNewUser(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
