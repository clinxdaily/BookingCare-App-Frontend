import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "./UserRedux.scss";
import { LANGUAGES, CRUD_Actions, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import TableManageUser from "./TableManageUser";

class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      positionArr: [],
      roleArr: [],
      previewImgURL: "",
      isOpen: false,
      isShowForm: false, // <-- Thêm biến điều khiển hiển thị form
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
      errorMessage: "",

      actions: "",
      userEditId: "",
    };
  }

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
    if (prevProps.user !== this.props.user) {
      const genderArr = this.props.genderRedux;
      const positionArr = this.props.positionRedux;
      const roleArr = this.props.roleRedux;

      this.setState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        address: "",
        phonenumber: "",
        gender: genderArr[0]?.keyMap || "",
        position: positionArr[0]?.keyMap || "",
        role: roleArr[0]?.keyMap || "",
        image: "",
        previewImgURL: "",
        actions: CRUD_Actions.CREATE,
      });
    }
  }

  handleOnchangeImg = async (e) => {
    const file = e.target.files[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      console.log("check base64: ", base64);
      const objectUrl = URL.createObjectURL(file);
      this.setState({ previewImgURL: objectUrl, image: base64 });
    }
  };

  onChangeInput = (e, id) =>
    this.setState({ [id]: e.target.value, errorMessage: "" });

  validate = () => {
    const { email, password, firstName, lastName, address, phonenumber } =
      this.state;
    if (!email.trim()) return "Email không được để trống.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email không hợp lệ.";
    if (!password.trim()) return "Mật khẩu không được để trống.";
    if (!firstName.trim()) return "Họ không được để trống.";
    if (!lastName.trim()) return "Tên không được để trống.";
    if (!address.trim()) return "Địa chỉ không được để trống.";
    if (!phonenumber.trim()) return "Số điện thoại không được để trống.";
    if (!/^\d{9,12}$/.test(phonenumber))
      return "Số điện thoại phải là số 9–12 ký tự.";
    return "";
  };

  handleSaveUser = () => {
    let err = this.validate();
    if (err) {
      this.setState({ errorMessage: err });
      return;
    }
    let { actions } = this.state;
    if (actions === CRUD_Actions.CREATE) {
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
        image: this.state.image,
      });
    }
    if (actions === CRUD_Actions.EDIT) {
      this.props.editUserRedux({
        id: this.state.userEditId,
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phonenumber: this.state.phonenumber,
        gender: this.state.gender,
        positionId: this.state.position,
        roleId: this.state.role,
        image: this.state.image,
      });
    }
  };
  handleEditUserFromParent = (user) => {
    let imageBase64 = "";
    if (user.image) {
      imageBase64 = new Buffer(user.image, "base64").toString("binary");
    }
    this.setState({
      email: user.email,
      password: "hashed_password",
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      phonenumber: user.phonenumber,
      gender: user.gender,
      position: user.positionId,
      role: user.roleId,
      image: "",
      previewImgURL: imageBase64,
      actions: CRUD_Actions.EDIT,
      userEditId: user.id,
      isShowForm: true, // Mở form khi chỉnh sửa
    });
  };
  resetFormState = () => {
    this.setState({
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
      previewImgURL: "",
      actions: "",
      userEditId: "",
      errorMessage: "",
      isShowForm: false, // Đảm bảo modal bị đóng
    });
  };
  render() {
    const {
      genderArr,
      positionArr,
      roleArr,
      previewImgURL,
      isOpen,
      isShowForm,
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
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}

        <div className="title text-center">Manage Users Redux</div>

        <div className="text-center mb-3">
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!isShowForm) {
                this.resetFormState(); // Reset dữ liệu khi mở modal
              }
              this.setState({ isShowForm: !isShowForm }); // Thay đổi trạng thái hiển thị modal
            }}
            // onClick={() => this.setState({ isShowForm: !isShowForm })}
          >
            <i className="fas fa-plus"></i>Add new users
          </button>
        </div>

        {isShowForm && (
          <form className="user-form" onSubmit={(e) => e.preventDefault()}>
            <button
              className="close-btn"
              onClick={() => this.setState({ isShowForm: false })}
            >
              &times;
            </button>
            <div className="form-row">
              <div className="form-field">
                <label>
                  <FormattedMessage id="manage-user.email" />
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => this.onChangeInput(e, "email")}
                  disabled={this.state.actions === CRUD_Actions.EDIT}
                />
              </div>
              <div className="form-field">
                <label>
                  <FormattedMessage id="manage-user.password" />
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => this.onChangeInput(e, "password")}
                  disabled={this.state.actions === CRUD_Actions.EDIT}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>
                  <FormattedMessage id="manage-user.first-name" />
                </label>
                <input
                  type="text"
                  value={firstName}
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
                  onChange={(e) => this.onChangeInput(e, "lastName")}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field full-width">
                <label>
                  <FormattedMessage id="manage-user.address" />
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => this.onChangeInput(e, "address")}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>
                  <FormattedMessage id="manage-user.phone-number" />
                </label>
                <input
                  type="text"
                  value={phonenumber}
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
                      style={{
                        backgroundImage: `url(${this.state.previewImgURL})`,
                      }}
                      onClick={() => this.setState({ isOpen: true })}
                    />
                  ) : (
                    <div className="preview-img placeholder">
                      <span>No image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {errorMessage && <div className="form-error">{errorMessage}</div>}
            <button
              type="button"
              className={
                this.state.actions === CRUD_Actions.EDIT
                  ? "btn-warning"
                  : "btn-submit"
              }
              onClick={this.handleSaveUser}
            >
              {this.state.actions === CRUD_Actions.EDIT ? (
                <FormattedMessage id="manage-user.edit" />
              ) : (
                <FormattedMessage id="manage-user.save" />
              )}
            </button>
          </form>
        )}

        <TableManageUser
          handleEditUserFromParent={this.handleEditUserFromParent}
          actions={this.state.actions}
        />
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
  user: state.admin.users,
});

const mapDispatchToProps = (dispatch) => ({
  getGenderStart: () => dispatch(actions.fetchGenderStart()),
  fetchPositionStart: () => dispatch(actions.fetchPositionStart()),
  fetchRoleStart: () => dispatch(actions.fetchRoleStart()),
  createNewUser: (data) => dispatch(actions.createNewUser(data)),
  editUserRedux: (data) => dispatch(actions.editUser(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
