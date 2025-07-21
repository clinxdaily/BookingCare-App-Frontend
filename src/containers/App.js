import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer, Bounce } from "react-toastify";
import HomePage from "./HomePage/HomePage.js";
import DetailDoctor from "./Patient/Doctor/DetailDoctor";
import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication";

import { path } from "../utils";

import Home from "../routes/Home";
import Login from "./Auth/Login";
import System from "../routes/System";
import Doctor from "../routes/Doctor.js";
import { CustomToastCloseButton } from "../components/CustomToast";
import VerifyEmail from "./Patient/VerifyEmail.js";
import DetailSpecialty from "./Patient/Specialty/DetailSpecialty.js";
import DetailClinic from "./Patient/Clinic/DetailClinic.js";
import DetailHandbook from "./Patient/Handbook/DetailHandbook.js";
import AllClinic from "./Patient/Clinic/AllClinic.js";
import AllSpecialty from "./Patient/Specialty/AllSpecialty.js";
import AllDoctor from "./Patient/Doctor/AllDoctor.js";
import AllHandbook from "./Patient/Handbook/AllHandbook.js";
class App extends Component {
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            <span className="content-container">
              <Switch>
                <Route path={path.HOME} exact component={Home} />
                <Route
                  path={path.LOGIN}
                  component={userIsNotAuthenticated(Login)}
                />
                <Route
                  path={path.SYSTEM}
                  component={userIsAuthenticated(System)}
                />
                <Route
                  path={"/doctor/"}
                  component={userIsAuthenticated(Doctor)}
                />
                <Route path={"/all-clinic/"} component={AllClinic} />
                <Route path={"/all-specialty/"} component={AllSpecialty} />
                <Route path={"/all-doctor/"} component={AllDoctor} />
                <Route path={"/all-handbook/"} component={AllHandbook} />
                <Route path={path.HOMEPAGE} component={HomePage} />
                DETAIL_SPECIALTY
                <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                <Route
                  path={path.DETAIL_SPECIALTY}
                  component={DetailSpecialty}
                />
                <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                <Route path={path.DETAIL_HANDBOOK} component={DetailHandbook} />
                <Route
                  path={path.VERIFY_EMAIL_BOOKING}
                  component={VerifyEmail}
                />
              </Switch>
            </span>

            {/* <ToastContainer
              className="toast-container"
              toastClassName="toast-item"
              bodyClassName="toast-item-body"
              autoClose={false}
              hideProgressBar={true}
              pauseOnHover={false}
              pauseOnFocusLoss={true}
              closeOnClick={false}
              draggable={false}
              closeButton={<CustomToastCloseButton />}
            /> */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              transition={Bounce}
            />
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
