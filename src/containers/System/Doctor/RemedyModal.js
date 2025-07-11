import React, { Component } from "react";
import { connect } from "react-redux";
import "./RemedyModal.scss";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { FormattedMessage } from "react-intl";
import { CommonUtils } from "../../../utils";

import * as actions from "../../../store/actions";

class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      imgBase64: "",
    };
  }
  async componentDidMount() {
    if (this.props.dataModal && this.props.dataModal.email) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.dataModal !== prevProps.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }
  handleOnChangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };
  handleOnchangeImg = async (e) => {
    const file = e.target.files[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);

      this.setState({ imgBase64: base64 });
    }
  };
  handleSendRemedy = () => {
    this.props.sendRemedy(this.state);
  };
  render() {
    let { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = this.props;
    return (
      <React.Fragment>
        <Modal
          isOpen={isOpenModal}
          className={"booking-modal-container"}
          size="xl"
          centered
          //   backdrop={true}
        >
          <ModalHeader toggle={closeRemedyModal}>Gửi hóa đơn </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-6 form-group">
                <div>
                  <label>Email bệnh nhân</label>
                  <input
                    className="form-control"
                    type="email"
                    value={this.state.email}
                    onChange={(event) => this.handleOnChangeEmail(event)}
                  ></input>
                </div>
              </div>
              <div className="col-6 form-group">
                <div>
                  <label>Chọn ảnh hóa đơn/đơn thuốc </label>
                  <input
                    className="form-control"
                    type="file"
                    onChange={(event) => this.handleOnchangeImg(event)}
                  ></input>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.handleSendRemedy()}>
              Gửi
            </Button>
            <Button color="secondary" onClick={closeRemedyModal}>
              Hủy
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
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
    getGender: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
