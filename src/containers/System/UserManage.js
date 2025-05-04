import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import { getAllUsers, createNewUserService, deleteUserService} from "../../services/userService";
import ModalUser from "./ModalUser";
import { reject } from "lodash";
import { emitter } from "../../utils/emitter";

class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      isOpenModalUser: false,
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
  }
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
  createNewUser = async(data) => {
    try {
        let response = await createNewUserService(data);
        if (response && response.errCode !== 0) {
            alert(response.errMessage);
        }else{
            await this.getAllUsers();
            this.setState({
                isOpenModalUser: false
            })
            emitter.emit("EVENT_CLEAR_MODAL_DATA"); //clear data đã nhập trước đó 
        }
    } catch (error) {
        reject(error);
    }
   
  }
  handleDeleteUser = async(user) => {
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
  }
  handleEditUser= () => {
    alert("edit");
  }
  render() {
   
    let arrUsers = this.state.arrUsers;
    return (
      <div className="users-container">
        <ModalUser
          isOpen={this.state.isOpenModalUser}
          toggleFromParent={this.toggleUserModal}
          createNewUser={this.createNewUser}
        />
        <div className="title text-center">Manage users</div>
        <div className="mx-1 ">
          <button
            className="btn btn-primary px-3"
            onClick={() => this.handleAddNewUser()}
          >
            <i className="fas fa-plus"></i> Add new users
          </button>
        </div>
        <div className="users-table mt-3 mx-1">
          <table id="customers">
            <tbody>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>Action</th>
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
                          <i className="fas fa-pencil-alt" onClick={()=>{this.handleEditUser()}}></i>
                        </button>
                        <button className="btn-delete">
                          <i className="fas fa-trash" onClick={()=>{this.handleDeleteUser(item)}}></i>
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
