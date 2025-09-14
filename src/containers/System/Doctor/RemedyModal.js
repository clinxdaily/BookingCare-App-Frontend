import React, { Component } from "react";
import { connect } from "react-redux";
import "./RemedyModal.scss";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { CommonUtils } from "../../../utils";

class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      mode: "image",
      imgBase64List: [],
      medicines: [{ name: "", quantity: "", unit: "viên", time: "" }],
      initialDiagnosis: "",
      conclusion: "",
      selectedImage: null, // ảnh được chọn để phóng to
    };
  }

  componentDidUpdate(prevProps) {
    const { dataRemedy } = this.props;
    if (dataRemedy && dataRemedy !== prevProps.dataRemedy) {
      this.setState({
        email: dataRemedy.email || "",
        mode: dataRemedy.type || "image",
        imgBase64List: dataRemedy.images ? JSON.parse(dataRemedy.images) : [],
        medicines: dataRemedy.medicines
          ? JSON.parse(dataRemedy.medicines)
          : [{ name: "", quantity: "", unit: "viên", time: "" }],
        initialDiagnosis: dataRemedy.initialDiagnosis || "",
        conclusion: dataRemedy.conclusion || "",
      });
    }
  }

  handleOnChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  handleOnChangeImg = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const base64List = [];
      for (let file of files) {
        const base64 = await CommonUtils.getBase64(file);
        base64List.push(base64);
      }
      this.setState({ imgBase64List: base64List });
    }
  };

  handleModeChange = (mode) => {
    this.setState({ mode });
  };

  handleMedicineChange = (index, field, value) => {
    const updated = [...this.state.medicines];
    updated[index][field] = value;
    this.setState({ medicines: updated });
  };

  handleAddMedicine = () => {
    this.setState((prev) => ({
      medicines: [
        ...prev.medicines,
        { name: "", quantity: "", unit: "viên", time: "" },
      ],
    }));
  };

  handleRemoveMedicine = (index) => {
    const updated = [...this.state.medicines];
    updated.splice(index, 1);
    this.setState({ medicines: updated });
  };

  handleSendRemedy = () => {
    const {
      email,
      mode,
      imgBase64List,
      medicines,
      initialDiagnosis,
      conclusion,
    } = this.state;

    const { doctorId, patientId, timeType, language, patientName } =
      this.props.dataRemedy;

    const dataToSend =
      mode === "image"
        ? {
            email,
            imgBase64List,
            type: "image",
            doctorId,
            patientId,
            timeType,
            language,
            patientName,
          }
        : {
            email,
            medicines,
            initialDiagnosis,
            conclusion,
            type: "manual",
            doctorId,
            patientId,
            timeType,
            language,
            patientName,
          };

    this.props.sendRemedy(dataToSend);
  };

  handleImageClick = (img) => {
    this.setState({ selectedImage: img });
  };

  closeImageModal = () => {
    this.setState({ selectedImage: null });
  };

  render() {
    const { isOpen, toggleFromParent, isReadOnly } = this.props;
    const {
      email,
      mode,
      imgBase64List,
      medicines,
      initialDiagnosis,
      conclusion,
      selectedImage,
    } = this.state;

    const unitOptions = ["viên", "vỉ", "hộp", "ống", "lọ", "gói", "ml", "mg"];

    return (
      <>
        <Modal
          isOpen={isOpen}
          className="booking-modal-container"
          size="xl"
          centered
        >
          <ModalHeader toggle={toggleFromParent}>
            {isReadOnly ? "Chi tiết đơn thuốc" : "Gửi đơn thuốc"}
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Email bệnh nhân</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={this.handleOnChangeEmail}
                readOnly={isReadOnly}
              />
            </div>

            {!isReadOnly && (
              <div className="form-group mt-3">
                <label>Chọn cách gửi:</label>
                <div className="d-flex gap-4 mt-2">
                  <div>
                    <input
                      type="radio"
                      id="image"
                      name="mode"
                      value="image"
                      checked={mode === "image"}
                      onChange={() => this.handleModeChange("image")}
                    />
                    <label htmlFor="image" className="ms-2">
                      Gửi bằng ảnh
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="manual"
                      name="mode"
                      value="manual"
                      checked={mode === "manual"}
                      onChange={() => this.handleModeChange("manual")}
                    />
                    <label htmlFor="manual" className="ms-2">
                      Nhập đơn thuốc
                    </label>
                  </div>
                </div>
              </div>
            )}

            {mode === "image" && (
              <>
                {!isReadOnly && (
                  <div className="form-group mt-3">
                    <label>Chọn ảnh đơn thuốc (nhiều ảnh)</label>
                    <input
                      className="form-control"
                      type="file"
                      multiple
                      onChange={this.handleOnChangeImg}
                    />
                  </div>
                )}
                {imgBase64List.length > 0 && (
                  <div className="image-preview-list mt-3">
                    {imgBase64List.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`img-${i}`}
                        className="preview-img me-2 mb-2"
                        onClick={() => this.handleImageClick(img)}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {mode === "manual" && (
              <div className="mt-4">
                <div className="form-group mb-3">
                  <label>Chuẩn đoán ban đầu</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={initialDiagnosis}
                    onChange={(e) =>
                      this.setState({ initialDiagnosis: e.target.value })
                    }
                    readOnly={isReadOnly}
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Kết luận</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={conclusion}
                    onChange={(e) =>
                      this.setState({ conclusion: e.target.value })
                    }
                    readOnly={isReadOnly}
                  />
                </div>

                <label>Danh sách thuốc</label>
                {medicines.map((med, index) => (
                  <div className="row mb-2" key={index}>
                    <div className="col-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tên thuốc"
                        value={med.name}
                        onChange={(e) =>
                          this.handleMedicineChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        readOnly={isReadOnly}
                      />
                    </div>
                    <div className="col-2">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Số lượng"
                        value={med.quantity}
                        onChange={(e) =>
                          this.handleMedicineChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        readOnly={isReadOnly}
                      />
                    </div>
                    <div className="col-2">
                      <select
                        className="form-control"
                        value={med.unit}
                        onChange={(e) =>
                          this.handleMedicineChange(
                            index,
                            "unit",
                            e.target.value
                          )
                        }
                        disabled={isReadOnly}
                      >
                        {unitOptions.map((unit, i) => (
                          <option key={i} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Thời gian uống"
                        value={med.time}
                        onChange={(e) =>
                          this.handleMedicineChange(
                            index,
                            "time",
                            e.target.value
                          )
                        }
                        readOnly={isReadOnly}
                      />
                    </div>
                    {!isReadOnly && (
                      <div className="col-1 d-flex align-items-center">
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => this.handleRemoveMedicine(index)}
                          disabled={medicines.length === 1}
                        >
                          X
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {!isReadOnly && (
                  <Button
                    color="success"
                    size="sm"
                    onClick={this.handleAddMedicine}
                  >
                    + Thêm thuốc
                  </Button>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            {!isReadOnly && (
              <Button color="primary" onClick={this.handleSendRemedy}>
                Gửi
              </Button>
            )}
            <Button color="secondary" onClick={toggleFromParent}>
              {isReadOnly ? "Đóng" : "Hủy"}
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal phóng to ảnh */}
        <Modal
          isOpen={!!selectedImage}
          toggle={this.closeImageModal}
          className="image-fullscreen-modal"
          size="lg"
          centered
        >
          <ModalBody className="text-center">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="full-view"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.closeImageModal}>
              Đóng
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default connect()(RemedyModal);
