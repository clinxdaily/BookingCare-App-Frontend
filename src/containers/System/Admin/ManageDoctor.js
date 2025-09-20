import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./ManageDoctor.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { CRUD_Actions, LANGUAGES } from "../../../utils";
import { getDetailInFoDoctor } from "../../../services/userService";
import { SiNamuwiki } from "react-icons/si";
const mdParser = new MarkdownIt({ html: true });

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentHTML: "",
      contentMarkdown: "",
      selectedOption: null,
      description: "",
      listDoctors: [],
      hasOldData: false, // To check if the doctor has old data

      //save info doctor table
      listPrice: [],
      listPayment: [],
      listProvince: [],
      listSpecialty: [],
      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      selectedSpecialty: "",
      note: "",
      specialtyId: "",
    };
  }
  componentDidMount() {
    this.props.fetchAllDoctor();
    this.props.getAllRequireDoctorInfo();
  }
  buildDataInputSelect = (data, type) => {
    let result = [];
    let { language } = this.props; // Assuming language is passed as a prop

    if (data && data.length > 0) {
      if (type === "USERS") {
        data.map((item) => {
          let object = {};
          let labelEn = `${item.firstName} ${item.lastName}`;
          let labelVi = `${item.lastName} ${item.firstName}`;

          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.id;
          result.push(object);
        });
      }
      if (type === "PRICE") {
        data.map((item) => {
          let object = {};
          let labelEn = `${item.valueEn} USD`;
          let labelVi = `${item.valueVi}`;

          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        });
      }
      if (type === "PAYMENT" || type === "PROVINCE") {
        data.map((item) => {
          let object = {};
          let labelEn = `${item.valueEn}`;
          let labelVi = `${item.valueVi}`;

          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        });
      }
      if (type === "SPECIALTY") {
        data.map((item) => {
          let object = {};

          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }
    }
    return result;
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      this.setState({
        listDoctors: dataSelect,
      });
    }
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      let { resPayment, resPrice, resProvince } =
        this.props.allRequireDoctorInfo;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE"
      );

      this.setState({
        listDoctors: dataSelect,
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
      });
    }
    if (prevProps.allRequireDoctorInfo !== this.props.allRequireDoctorInfo) {
      let { resPayment, resPrice, resProvince, resSpecialty } =
        this.props.allRequireDoctorInfo;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE"
      );
      let dataSelectSpecialty = this.buildDataInputSelect(
        resSpecialty,
        "SPECIALTY"
      );

      this.setState({
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
        listSpecialty: dataSelectSpecialty,
      });
    }
  }
  // Finish!
  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentHTML: html,
      contentMarkdown: text,
    });
  };
  handleSaveContentMarkdown = () => {
    let { hasOldData } = this.state;
    this.props.saveDetailDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedOption.value,
      action: hasOldData === true ? CRUD_Actions.EDIT : CRUD_Actions.CREATE,

      selectedPrice: this.state.selectedPrice.value,
      selectedPayment: this.state.selectedPayment.value,
      selectedProvince: this.state.selectedProvince.value,
      note: this.state.note,
      specialtyId: this.state.selectedSpecialty.value,
    });
  };
  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption });
    let { listPayment, listProvince, listPrice, listSpecialty } = this.state;
    let res = await getDetailInFoDoctor(selectedOption.value);

    if (res && res.errCode === 0 && res.data && res.data.Markdown) {
      let markdown = res.data.Markdown;

      // Khai báo biến cục bộ rõ ràng
      let note = "";
      let paymentId = "";
      let priceId = "";
      let provinceId = "";
      let specialtyId = "";
      let selectedPayment = "";
      let selectedPrice = "";
      let selectedProvince = "";
      let selectedSpecialty = "";

      if (res.data.Doctor_Info) {
        note = res.data.Doctor_Info.note;
        paymentId = res.data.Doctor_Info.paymentId;
        priceId = res.data.Doctor_Info.priceId;
        provinceId = res.data.Doctor_Info.provinceId;
        specialtyId = res.data.Doctor_Info.specialtyId;

        selectedPayment = listPayment.find(
          (item) => item && item.value === paymentId
        );
        selectedPrice = listPrice.find(
          (item) => item && item.value === priceId
        );
        selectedProvince = listProvince.find(
          (item) => item && item.value === provinceId
        );
        selectedSpecialty = listSpecialty.find(
          (item) => item && item.value === specialtyId
        );
      }

      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        hasOldData: true,
        note,
        selectedPayment,
        selectedPrice,
        selectedProvince,
        selectedSpecialty,
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        hasOldData: false,
        note: "",
        selectedPayment: "",
        selectedPrice: "",
        selectedProvince: "",
        selectedSpecialty: "",
      });
    }

    console.log("check res from doctor detail: ", res);
  };

  handleChangeSelectDoctorInfo = async (selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({ ...stateCopy });
  };
  handleOnChangeDescription = (event, id) => {
    this.setState({
      [id]: event.target.value,
    });
  };
  render() {
    let { hasOldData, listSpecialty } = this.state;
    console.log("check state", this.state);
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title text-center">
          <FormattedMessage id="manage-doctor.title" />
        </div>
        <div className="more-info row">
          <div className="content-left form-group">
            <label>
              {" "}
              <FormattedMessage id="manage-doctor.select-doctor" />
            </label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors}
              placeholder={
                <FormattedMessage id="manage-doctor.placeholder.select-doctor" />
              }
              name={"selectedOption"}
            />
          </div>
        </div>
        <div className="more-info-2 row">
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="manage-doctor.select-price" />
            </label>
            <Select
              value={this.state.selectedPrice}
              onChange={this.handleChangeSelectDoctorInfo}
              options={this.state.listPrice}
              placeholder={
                <FormattedMessage id="manage-doctor.placeholder.select-price" />
              }
              name={"selectedPrice"}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="manage-doctor.select-payment" />
            </label>
            <Select
              value={this.state.selectedPayment}
              onChange={this.handleChangeSelectDoctorInfo}
              options={this.state.listPayment}
              placeholder={
                <FormattedMessage id="manage-doctor.placeholder.select-payment" />
              }
              name={"selectedPayment"}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              {" "}
              <FormattedMessage id="manage-doctor.select-province" />
            </label>
            <Select
              value={this.state.selectedProvince}
              onChange={this.handleChangeSelectDoctorInfo}
              options={this.state.listProvince}
              placeholder={
                <FormattedMessage id="manage-doctor.placeholder.select-province" />
              }
              name={"selectedProvince"}
            />
          </div>

          <div className="col-4 form-group">
            <label>
              {" "}
              <FormattedMessage id="manage-doctor.note" />
            </label>
            <input
              className="form-control"
              onChange={(event) =>
                this.handleOnChangeDescription(event, "note")
              }
              value={this.state.note}
            ></input>
          </div>
          <div className="col-4 form-group">
            <label>Chọn chuyên khoa</label>
            <Select
              value={this.state.selectedSpecialty}
              onChange={this.handleChangeSelectDoctorInfo}
              options={this.state.listSpecialty}
              placeholder={
                <FormattedMessage id="manage-doctor.placeholder.select-specialty" />
              }
              name={"selectedSpecialty"}
            />
          </div>
        </div>
        <div className="content-right">
          <label>
            <FormattedMessage id="manage-doctor.intro" />
          </label>
          <textarea
            className="form-control"
            rows="4"
            onChange={(event) =>
              this.handleOnChangeDescription(event, "description")
            }
            value={this.state.description}
          ></textarea>
        </div>

        <div className="manage-doctor-editor">
          <label>
            <FormattedMessage id="manage-doctor.detail-intro" />
          </label>
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.contentMarkdown}
          />
        </div>
        <div className="btn-wrapper">
          <button
            className={
              hasOldData === true
                ? "btn btn-primary"
                : "btn create-content-doctor"
            }
            onClick={() => this.handleSaveContentMarkdown()}
          >
            {hasOldData === true ? (
              <span>
                <FormattedMessage id="manage-doctor.save" />
              </span>
            ) : (
              <span>
                <FormattedMessage id="manage-doctor.create" />
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allDoctors: state.admin.allDoctors,
    allRequireDoctorInfo: state.admin.allRequireDoctorInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctor: (id) => {
      dispatch(actions.fetchAllDoctor());
    },
    saveDetailDoctor: (data) => {
      dispatch(actions.saveDetailDoctor(data));
    },
    getAllRequireDoctorInfo: () => dispatch(actions.getRequireDoctorInfo()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
