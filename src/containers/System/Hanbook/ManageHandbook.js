import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageHandbook.scss"; // 👉 tạo file SCSS riêng, có thể copy từ ManageSpecialty.scss và đổi class
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { CommonUtils } from "../../../utils";
import {
  createNewHandbook,
  getAllHandbooks,
  editHandbook,
  deleteHandbook,
} from "../../../services/userService"; // 👉 đảm bảo đã viết các API này
import { toast } from "react-toastify";

const mdParser = new MarkdownIt({ html: true });

class ManageHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imgBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      listHandbooks: [],
      action: "CREATE", // CREATE | EDIT
      editId: null,
    };
    this.fileInputRef = React.createRef();
  }

  async componentDidMount() {
    await this.fetchHandbooks();
  }

  fetchHandbooks = async () => {
    const res = await getAllHandbooks();
    if (res && res.errCode === 0) {
      this.setState({ listHandbooks: res.data || [] });
    } else {
      toast.error(res?.errMessage || "Không lấy được danh sách cẩm nang!");
    }
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleOnchangeImg = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await CommonUtils.getBase64(file);
      this.setState({ imgBase64: base64 });
    }
  };

  handleOnChangeInput = (event, key) => {
    this.setState({ [key]: event.target.value });
  };

  handleSaveHandbook = async () => {
    const {
      action,
      editId,
      name,
      imgBase64,
      descriptionHTML,
      descriptionMarkdown,
    } = this.state;

    // Validate đơn giản
    if (!name) {
      toast.warn("Vui lòng nhập tên cẩm nang!");
      return;
    }

    if (action === "CREATE") {
      const res = await createNewHandbook({
        name,
        imgBase64,
        descriptionHTML,
        descriptionMarkdown,
      });
      if (res && res.errCode === 0) {
        toast.success("Tạo cẩm nang thành công!");
        this.resetForm();
        await this.fetchHandbooks();
      } else {
        toast.error(res?.errMessage || "Lỗi khi tạo cẩm nang!");
      }
      return;
    }

    if (action === "EDIT") {
      const res = await editHandbook({
        id: editId,
        name,
        imgBase64, // nếu không đổi ảnh thì gửi lại ảnh cũ
        descriptionHTML,
        descriptionMarkdown,
      });
      if (res && res.errCode === 0) {
        toast.success("Cập nhật cẩm nang thành công!");
        this.resetForm();
        await this.fetchHandbooks();
      } else {
        toast.error(res?.errMessage || "Lỗi khi cập nhật cẩm nang!");
      }
    }
  };

  handleEditHandbook = (item) => {
    this.setState({
      name: item.name,
      imgBase64: item.image || "",
      descriptionHTML: item.descriptionHTML || "",
      descriptionMarkdown: item.descriptionMarkdown || "",
      action: "EDIT",
      editId: item.id,
    });
    if (this.fileInputRef.current) this.fileInputRef.current.value = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  handleDeleteHandbook = async (item) => {
    if (!window.confirm(`Bạn có chắc muốn xóa cẩm nang "${item.name}"?`))
      return;
    const res = await deleteHandbook(item.id);
    if (res && res.errCode === 0) {
      toast.success("Xóa thành công!");
      await this.fetchHandbooks();
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
    if (this.fileInputRef.current) this.fileInputRef.current.value = null;
  };

  render() {
    const { listHandbooks, action, name, imgBase64, descriptionMarkdown } =
      this.state;

    return (
      <div className="manage-specialty-container">
        <div className="manage-specialty-title">Quản lý cẩm nang</div>

        <h4>
          {action === "CREATE"
            ? "Thêm thông tin cẩm nang"
            : "Chỉnh sửa thông tin cẩm nang"}
        </h4>
        <div className="add-new-specialty row">
          <div className="col-6 form-group">
            <label>Tên cẩm nang</label>
            <input
              className="form-control"
              type="text"
              value={name}
              onChange={(event) => this.handleOnChangeInput(event, "name")}
            />
          </div>

          <div className="col-6 form-group">
            <label>Ảnh cẩm nang</label>
            <div className="image-upload-row">
              <label htmlFor="specialty-img" className="upload-btn">
                <i className="fas fa-upload" /> Chọn ảnh
              </label>
              <input
                id="specialty-img"
                type="file"
                accept="image/*"
                onChange={this.handleOnchangeImg}
                ref={this.fileInputRef}
                style={{ display: "none" }}
              />

              {imgBase64 ? (
                <div
                  className="preview-img"
                  style={{ backgroundImage: `url(${imgBase64})` }}
                />
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
              value={descriptionMarkdown}
            />
          </div>

          <div className="col-12 btn-save-wrapper">
            <button
              className={
                action === "CREATE" ? "btn btn-primary" : "btn btn-warning"
              }
              onClick={this.handleSaveHandbook}
            >
              {action === "CREATE" ? "Lưu" : "Cập nhật"}
            </button>
            {action === "EDIT" && (
              <button
                className="btn btn-secondary ml-2 btn-cancer"
                onClick={this.resetForm}
              >
                Hủy
              </button>
            )}
          </div>
        </div>

        {/* Bảng danh sách cẩm nang */}
        <div className="specialty-table mt-4">
          <h4>Danh sách cẩm nang</h4>
          <table id="customers">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên cẩm nang</th>
                <th>Ảnh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {listHandbooks && listHandbooks.length > 0 ? (
                listHandbooks.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td style={{ textAlign: "center" }}>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt="handbook"
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
                        onClick={() => this.handleEditHandbook(item)}
                      >
                        <i className="fas fa-pencil-alt" />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => this.handleDeleteHandbook(item)}
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Không có cẩm nang nào
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

export default connect()(ManageHandbook);
