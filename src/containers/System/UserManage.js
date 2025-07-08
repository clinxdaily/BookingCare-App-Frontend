import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import {
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
} from "../../services/userService";
import ModalUser from "./ModalUser";
import ModalEditUser from "./ModalEditUser";
import { reject } from "lodash";
import { emitter } from "../../utils/emitter";

class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      isOpenModalUser: false,
      isOpenModalEditUser: false,
      userEdit: {},
    };
  }

  async componentDidMount() {
    await this.getAllUsers();
  }

  getAllUsers = async () => {
    let response = await getAllUsers("ALL");
    if (response && response.errCode === 0) {
      this.setState({
        arrUsers: response.users,
      });
    }
  };
  handleAddNewUser = () => {
    this.setState({
      isOpenModalUser: true,
    });
  };
  toggleUserModal = () => {
    this.setState({
      isOpenModalUser: !this.state.isOpenModalUser,
    });
  };
  toggleUserEditModal = () => {
    this.setState({
      isOpenModalEditUser: !this.state.isOpenModalEditUser,
    });
  };
  createNewUser = async (data) => {
    try {
      let response = await createNewUserService(data);
      if (response && response.errCode !== 0) {
        alert(response.errMessage);
      } else {
        await this.getAllUsers();
        this.setState({
          isOpenModalUser: false,
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA"); //clear data đã nhập trước đó
      }
    } catch (error) {
      reject(error);
    }
  };
  handleDeleteUser = async (user) => {
    console.log("delete", user);
    try {
      let respone = await deleteUserService(user.id);
      if (respone && respone.errCode === 0) {
        await this.getAllUsers();
      } else {
        alert(respone.errMessage);
      }
    } catch (error) {
      reject(error);
    }
  };
  handleEditUser = (user) => {
    this.setState({
      isOpenModalEditUser: true,
      userEdit: user,
    });
  };
  doEditUser = async (user) => {
    try {
      let res = await editUserService(user);
      if (res && res.errCode === 0) {
        this.setState({
          isOpenModalEditUser: false,
        });
        await this.getAllUsers();
      } else {
        alert(res.errCode);
      }
    } catch (error) {
      reject(error);
    }
  };
  render() {
    let arrUsers = this.state.arrUsers;
    return (
      <div className="users-container">
        <ModalUser
          isOpen={this.state.isOpenModalUser}
          toggleFromParent={this.toggleUserModal}
          createNewUser={this.createNewUser}
        />
        {this.state.isOpenModalEditUser && (
          <ModalEditUser
            isOpen={this.state.isOpenModalEditUser}
            toggleFromParent={this.toggleUserEditModal}
            currentUser={this.state.userEdit}
            editUser={this.doEditUser}
          />
        )}

        <div className="title text-center">
          <FormattedMessage id="user-manage.title" />
        </div>
        <div className="mx-1 text-center">
          <button
            className="btn btn-primary px-3 "
            onClick={() => this.handleAddNewUser()}
          >
            <i className="fas fa-plus"></i>{" "}
            <FormattedMessage id="user-manage.add-new" />
          </button>
        </div>
        <div className="users-table mt-3 mx-1">
          <table id="customers">
            <tbody>
              <tr>
                <th>
                  <FormattedMessage id="user-manage.email" />
                </th>
                <th>
                  <FormattedMessage id="user-manage.first-name" />
                </th>
                <th>
                  <FormattedMessage id="user-manage.last-name" />
                </th>
                <th>
                  <FormattedMessage id="user-manage.address" />
                </th>
                <th>
                  <FormattedMessage id="user-manage.action" />
                </th>
              </tr>

              {arrUsers &&
                arrUsers.map((item, index) => {
                  return (
                    <tr key={item.id || index}>
                      <td>{item.email}</td>
                      <td>{item.firstName}</td>
                      <td> {item.lastName}</td>
                      <td> {item.address}</td>
                      <td>
                        <button className="btn-edit">
                          <i
                            className="fas fa-pencil-alt"
                            onClick={() => {
                              this.handleEditUser(item);
                            }}
                          ></i>
                        </button>
                        <button className="btn-delete">
                          <i
                            className="fas fa-trash"
                            onClick={() => {
                              this.handleDeleteUser(item);
                            }}
                          ></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
