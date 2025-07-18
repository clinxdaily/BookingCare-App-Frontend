import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./DetailClinic.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfo from "../Doctor/DoctorExtraInfo";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
  getDetailClinicById,
  getAllCodeService,
} from "../../../services/userService";
import _ from "lodash";
import { LANGUAGES } from "../../../utils";
class DetailClinic extends Component {
  constructor(props) {
    super(props);
    this.state = { arrDoctorId: [], dataDetailClinic: {} };
  }
  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let res = await getDetailClinicById({ id: id });
      console.log("API res:", res);
      if (res && res.errCode === 0) {
        let data = res.data;
        let arrDoctorId = [];
        if (data && !_.isEmpty(data)) {
          let arr = data.doctorClinic;
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }

        this.setState({
          dataDetailClinic: res.data,
          arrDoctorId: arrDoctorId,
        });
      }
    }
  }

  render() {
    let { arrDoctorId, dataDetailClinic } = this.state;
    let { language } = this.props;
    return (
      <>
        <HomeHeader />

        <div className="detail-specialty-container">
          <div className="detail-specialty-description">
            {dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
              <>
                <div className="clinic-name">{dataDetailClinic.name}</div>
                <div className="clinic-address">{dataDetailClinic.address}</div>

                <div
                  dangerouslySetInnerHTML={{
                    __html: dataDetailClinic.descriptionHTML,
                  }}
                ></div>
              </>
            )}
          </div>

          {arrDoctorId &&
            arrDoctorId.length > 0 &&
            arrDoctorId.map((item, index) => {
              return (
                <div className="each-doctor" key={index}>
                  <div className="top-profile">
                    <ProfileDoctor
                      doctorId={item}
                      isShowIntro={true}
                      isShowLinkDetail={true}
                      isShowPrice={false}
                    />
                  </div>
                  <div className="bottom-info">
                    <div className="left-schedule">
                      <DoctorSchedule doctorIdFromParent={item} />
                    </div>
                    <div className="right-extra">
                      <DoctorExtraInfo doctorIdFromParent={item} />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
