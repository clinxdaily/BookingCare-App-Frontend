import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./TableManageUser.scss";
import MarkdownIt from "markdown-it";

// import style manually
import "react-markdown-editor-lite/lib/index.css";

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log("handleEditorChange", html, text);
}

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
  handleEditUser = (userId) => {
    this.props.handleEditUserFromParent(userId);
  };
  render() {
    let arrUSers = this.state.usersRedux;
    return (
      <React.Fragment>
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
                        <i
                          className="fas fa-pencil-alt"
                          onClick={() => this.handleEditUser(item)}
                        ></i>
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
      </React.Fragment>
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
