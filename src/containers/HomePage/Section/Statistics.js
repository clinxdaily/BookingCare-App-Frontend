import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./Statistics.scss";
import {
  FaStethoscope,
  FaHospital,
  FaBuilding,
  FaUserMd,
  FaPaperPlane,
  FaEye,
} from "react-icons/fa";

class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: [
        {
          id: 1,
          icon: <FaStethoscope />,
          number: "3.0M+",
          label: "Lượt khám",
          color: "#3498db",
        },
        {
          id: 2,
          icon: <FaBuilding />,
          number: "300+",
          label: "Cơ sở Y tế",
          color: "#2ecc71",
        },
        {
          id: 3,
          icon: <FaHospital />,
          number: "50+",
          label: "Bệnh viện",
          color: "#e74c3c",
        },
        {
          id: 4,
          icon: <FaUserMd />,
          number: "1000+",
          label: "Bác sĩ",
          color: "#9b59b6",
        },
        {
          id: 5,
          icon: <FaPaperPlane />,
          number: "850K+",
          label: "Lượt truy cập tháng",
          color: "#f39c12",
        },
        {
          id: 6,
          icon: <FaEye />,
          number: "28.3K+",
          label: "Lượt truy cập trong ngày",
          color: "#1abc9c",
        },
      ],
      animatedNumbers: {},
    };
  }

  componentDidMount() {
    this.animateNumbers();
  }

  animateNumbers = () => {
    const { stats } = this.state;
    const animatedNumbers = {};

    stats.forEach((stat) => {
      const targetNumber = parseInt(stat.number.replace(/[^\d]/g, ""));
      let currentNumber = 0;
      const increment = targetNumber / 100;
      const suffix = stat.number.replace(/[\d.]/g, "");

      const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
          currentNumber = targetNumber;
          clearInterval(timer);
        }

        if (targetNumber >= 1000) {
          const formattedNumber = (currentNumber / 1000).toFixed(1);
          animatedNumbers[stat.id] = formattedNumber + suffix;
        } else {
          animatedNumbers[stat.id] = Math.floor(currentNumber) + suffix;
        }

        this.setState({ animatedNumbers: { ...animatedNumbers } });
      }, 20);
    });
  };

  render() {
    const { stats, animatedNumbers } = this.state;

    return (
      <div className="section-statistics">
        <div className="statistics-content">
          {/* <div className="section-header">
            <div className="section-title">
              <h2>
                <FormattedMessage
                  id="homepage.statistics"
                  defaultMessage="Thống kê"
                />
              </h2>
            </div>
          </div> */}

          <div className="statistics-grid">
            {stats.map((stat) => (
              <div key={stat.id} className="stat-item">
                <div className="stat-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <div className="stat-number" style={{ color: stat.color }}>
                    {animatedNumbers[stat.id] || "0"}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
