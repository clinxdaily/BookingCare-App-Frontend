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
      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      nameClinic: "",
      addressClinic: "",
      note: "",
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
      data.map((item) => {
        let object = {};
        let labelEn =
          type === "USERS"
            ? `${item.firstName} ${item.lastName}`
            : item.valueEn;
        let labelVi =
          type === "USERS"
            ? `${item.lastName} ${item.firstName}`
            : item.valueVi;
        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
      });
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
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      });
    }
    if (prevProps.allRequireDoctorInfo !== this.props.allRequireDoctorInfo) {
      let { resPayment, resPrice, resProvince } =
        this.props.allRequireDoctorInfo;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE"
      );

      this.setState({
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
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
    });
  };
  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption });
    let res = await getDetailInFoDoctor(selectedOption.value);
    if (res && res.errCode === 0 && res.data && res.data.Markdown) {
      let markdown = res.data.Markdown;

      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        hasOldData: true, // Set to true if old data exists
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        hasOldData: false, // Reset if no old data
      });
    }
    console.log("check res from doctor detail: ", res);
  };
  handleOnChangeDescription = (event) => {
    this.setState({
      description: event.target.value,
    });
  };
  render() {
    let { hasOldData } = this.state;
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title text-center">Manage Doctor</div>
        <div className="more-info row">
          <div className="content-left form-group">
            <label>Chọn bác sĩ</label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors}
              placeholder={"Chọn bác sĩ..."}
            />
          </div>
        </div>
        <div className="more-info-2 row">
          <div className="col-4 form-group">
            <label>Chọn giá</label>
            <Select
              // value={this.state.selectedOption}
              // onChange={this.handleChangeSelect}
              options={this.state.listPrice}
              placeholder={"Chọn giá..."}
            />
          </div>
          <div className="col-4 form-group">
            <label>Chọn phương thức thanh toán </label>
            <Select
              // value={this.state.selectedOption}
              // onChange={this.handleChangeSelect}
              options={this.state.listPayment}
              placeholder={"Chọn phương thức thanh toán..."}
            />
          </div>
          <div className="col-4 form-group">
            <label>Chọn tỉnh thành</label>
            <Select
              // value={this.state.selectedOption}
              // onChange={this.handleChangeSelect}
              options={this.state.listProvince}
              placeholder={"Chọn tỉnh thành..."}
            />
          </div>
          <div className="col-4 form-group">
            <label>Tên phòng khám</label>
            <input className="col-4 form-group"></input>
          </div>
          <div className="col-4 form-group">
            <label>Địa chỉ phòng khám</label>
            <input className="col-4 form-group"></input>
          </div>
          <div className="col-4 form-group">
            <label>Ghi chú </label>
            <input className="col-4 form-group"></input>
          </div>
        </div>
        <div className="content-right">
          <label>Thông tin giới thiệu</label>
          <textarea
            className="form-control"
            rows="4"
            onChange={(event) => this.handleOnChangeDescription(event)}
            value={this.state.description}
          ></textarea>
        </div>

        <div className="manage-doctor-editor">
          <label>Thông tin giới thiệu chi tiết </label>
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
              <span>Lưu thông tin</span>
            ) : (
              <span>Tạo thông tin</span>
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
