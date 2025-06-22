import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./TableManageUser.scss";

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = { usersRedux: [] };
  }
  componentDidMount() {
    this.props.fetchUserRedux();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    // if (prevState.usersRedux !== this.props.user) {
    //   this.setState({
    //     usersRedux: this.props.user,
    //   });
    // }
    if (prevProps.user !== this.props.user) {
      this.setState({
        usersRedux: this.props.user,
      });
    }
  }
  handleDeleteUser = (userId) => {
    this.props.deleteUserRedux(userId.id);
  };
  render() {
    let arrUSers = this.state.usersRedux;
    return (
      <table id="customers">
        <tbody>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
          {arrUSers &&
            arrUSers.length > 0 &&
            arrUSers.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.email}</td>
                  <td>{item.firstName}</td>
                  <td> {item.lastName}</td>
                  <td> {item.address}</td>
                  <td>
                    <button className="btn-edit">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => this.handleDeleteUser(item)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: () => {
      dispatch(actions.fetchAllUserStart());
    },
    deleteUserRedux: (userId) => {
      dispatch(actions.deleteUser(userId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
