import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSpecialty.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { CommonUtils } from "../../../utils";
import {
  createNewSpecialty,
  getAllSpecialties,
  editSpecialty,
  deleteSpecialty,
} from "../../../services/userService";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt({ html: true });

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imgBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      listSpecialties: [],
      action: "CREATE", // "CREATE" hoặc "EDIT"
      editId: null,
    };
    this.fileInputRef = React.createRef();
  }

  async componentDidMount() {
    await this.fetchSpecialties();
  }

  fetchSpecialties = async () => {
    let res = await getAllSpecialties();
    if (res && res.errCode === 0) {
      this.setState({
        listSpecialties: res.data || [],
      });
    }
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleOnchangeImg = async (e) => {
    const file = e.target.files[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({ imgBase64: base64 });
    }
  };

  handleOnChangeInput = (event, id) => {
    this.setState({
      [id]: event.target.value,
    });
  };

  handleSaveSpecialty = async () => {
    const {
      action,
      editId,
      name,
      imgBase64,
      descriptionHTML,
      descriptionMarkdown,
    } = this.state;

    if (action === "CREATE") {
      const res = await createNewSpecialty({
        name,
        imgBase64,
        descriptionHTML,
        descriptionMarkdown,
      });
      if (res && res.errCode === 0) {
        toast.success("Tạo chuyên khoa thành công!");
        this.resetForm();
        await this.fetchSpecialties();
      } else {
        toast.error(res?.errMessage || "Lỗi khi tạo chuyên khoa!");
      }
      return;
    }

    if (action === "EDIT") {
      const res = await editSpecialty({
        id: editId,
        name,
        imgBase64, // nếu không đổi ảnh thì giữ imgBase64 = item.image cũ
        descriptionHTML,
        descriptionMarkdown,
      });
      if (res && res.errCode === 0) {
        toast.success("Cập nhật chuyên khoa thành công!");
        this.resetForm();
        await this.fetchSpecialties();
      } else {
        toast.error(res?.errMessage || "Lỗi khi cập nhật chuyên khoa!");
      }
    }
  };

  handleEditSpecialty = (item) => {
    this.setState({
      name: item.name,
      imgBase64: item.image, // giữ base64 để gửi lại nếu user không chọn ảnh mới
      descriptionHTML: item.descriptionHTML || "",
      descriptionMarkdown: item.descriptionMarkdown || "",
      action: "EDIT",
      editId: item.id,
    });
    if (this.fileInputRef.current) this.fileInputRef.current.value = null;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  handleDeleteSpecialty = async (item) => {
    if (!window.confirm(`Bạn có chắc muốn xóa chuyên khoa "${item.name}"?`))
      return;
    const res = await deleteSpecialty(item.id);
    if (res && res.errCode === 0) {
      toast.success("Xóa thành công!");
      await this.fetchSpecialties();
    } else {
      toast.error(res?.errMessage || "Xóa thất bại!");
    }
  };

  resetForm = () => {
    this.setState({
      name: "",
      imgBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      action: "CREATE",
      editId: null,
    });
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = null;
    }
  };

  render() {
    let { listSpecialties } = this.state;
    return (
      <div className="manage-specialty-container">
        <div className="manage-specialty-title">Quản lý chuyên khoa</div>

        <h4>
          {this.state.action === "CREATE"
            ? "Thêm thông tin chuyên khoa"
            : "Chỉnh sửa thông tin chuyên khoa"}
        </h4>
        <div className="add-new-specialty row">
          <div className="col-6 form-group">
            <label>Tên chuyên khoa</label>
            <input
              className="form-control"
              type="text"
              value={this.state.name}
              onChange={(event) => this.handleOnChangeInput(event, "name")}
            />
          </div>

          <div className="col-6 form-group">
            <label>Ảnh chuyên khoa</label>
            <div className="image-upload-row">
              <label htmlFor="specialty-img" className="upload-btn">
                <i className="fas fa-upload"></i> Chọn ảnh
              </label>
              <input
                id="specialty-img"
                type="file"
                accept="image/*"
                onChange={this.handleOnchangeImg}
                ref={this.fileInputRef}
                style={{ display: "none" }}
              />

              {this.state.imgBase64 ? (
                <div
                  className="preview-img"
                  style={{
                    backgroundImage: `url(${this.state.imgBase64})`,
                  }}
                ></div>
              ) : (
                <div className="preview-img no-image">Chưa có ảnh</div>
              )}
            </div>
          </div>

          <div className="col-12">
            <MdEditor
              style={{ height: "400px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.descriptionMarkdown}
            />
          </div>

          <div className="col-12 btn-save-wrapper">
            <button
              className={
                this.state.action === "CREATE"
                  ? "btn btn-primary"
                  : "btn btn-warning"
              }
              onClick={this.handleSaveSpecialty}
            >
              {this.state.action === "CREATE" ? "Lưu" : "Cập nhật"}
            </button>
            {this.state.action === "EDIT" && (
              <button
                className="btn btn-secondary ml-2 btn-cancer"
                onClick={this.resetForm}
              >
                Hủy
              </button>
            )}
          </div>
        </div>

        {/* Bảng hiển thị danh sách chuyên khoa */}
        <div className="specialty-table mt-4">
          <h4>Danh sách chuyên khoa</h4>
          <table id="customers">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên chuyên khoa</th>
                <th>Ảnh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {listSpecialties && listSpecialties.length > 0 ? (
                listSpecialties.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt="specialty"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          "No image"
                        )}
                      </td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => this.handleEditSpecialty(item)}
                        >
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => this.handleDeleteSpecialty(item)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Không có chuyên khoa nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connect()(ManageSpecialty);
