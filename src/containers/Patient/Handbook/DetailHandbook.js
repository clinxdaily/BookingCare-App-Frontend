import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailHandbook.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { getDetailHandbookById } from "../../../services/userService"; // API lấy chi tiết cẩm nang
import _ from "lodash";

class DetailHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDetailHandbook: {},
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let res = await getDetailHandbookById({ id });
      console.log("handbook detail:", res);

      if (res && res.errCode === 0) {
        this.setState({
          dataDetailHandbook: res.data || {},
        });
      }
    }
  }

  render() {
    let { dataDetailHandbook } = this.state;
    return (
      <>
        <HomeHeader />
        <div className="detail-handbook-container">
          <div className="detail-handbook-title">
            <h2>{dataDetailHandbook.name || "Chi tiết cẩm nang"}</h2>
          </div>
          <div className="detail-handbook-content">
            {dataDetailHandbook && !_.isEmpty(dataDetailHandbook) && (
              <div
                dangerouslySetInnerHTML={{
                  __html: dataDetailHandbook.descriptionHTML,
                }}
              ></div>
            )}
          </div>
        </div>
        <HomeFooter />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(DetailHandbook);
