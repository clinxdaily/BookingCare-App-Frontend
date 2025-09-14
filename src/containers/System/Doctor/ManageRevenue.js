import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageRevenue.scss";
import DatePicker from "../../../components/Input/DatePicker";
import { getRevenue } from "../../../services/userService";
import moment from "moment";
import { toast } from "react-toastify";

class ManageRevenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(),
      filterType: "date", // "date" | "month" | "year"
      isLoading: false,
      revenueData: {
        totalAppointments: 0,
        totalRevenue: 0,
        pricePerAppointment: 0,
        currency: "VND",
      },
      error: null,
    };
  }

  componentDidMount() {
    this.fetchRevenueData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user?.id !== this.props.user?.id) {
      this.fetchRevenueData();
    }
  }

  handleOnChangeDatePicker = (date) => {
    if (!date || !date[0]) return;
    this.setState({ currentDate: date[0], error: null }, this.fetchRevenueData);
  };

  handleFilterTypeChange = (event) => {
    this.setState({ filterType: event.target.value }, this.fetchRevenueData);
  };

  // Xử lý thay đổi năm
  handleYearChange = (event) => {
    const year = parseInt(event.target.value);
    const newDate = new Date(year, 0, 1); // Ngày 1/1 của năm được chọn
    this.setState({ currentDate: newDate, error: null }, this.fetchRevenueData);
  };

  // Xử lý thay đổi tháng
  handleMonthChange = (event) => {
    const [year, month] = event.target.value.split("-");
    const newDate = new Date(parseInt(year), parseInt(month) - 1, 1); // Ngày 1 của tháng được chọn
    this.setState({ currentDate: newDate, error: null }, this.fetchRevenueData);
  };

  fetchRevenueData = async () => {
    const { user } = this.props;
    const { currentDate, filterType } = this.state;

    if (!user?.id || user.roleId !== "R2") {
      return;
    }

    this.setState({ isLoading: true, error: null });

    try {
      let timestamp;

      if (filterType === "date") {
        timestamp = moment(currentDate).startOf("day").valueOf();
      } else if (filterType === "month") {
        timestamp = moment(currentDate).startOf("month").valueOf();
      } else if (filterType === "year") {
        timestamp = moment(currentDate).startOf("year").valueOf();
      }

      const response = await getRevenue(user.id, timestamp, filterType);

      if (response?.errCode === 0) {
        this.setState({
          revenueData: {
            totalAppointments: response.data.totalAppointments || 0,
            totalRevenue: response.data.totalRevenue || 0,
            pricePerAppointment: response.data.pricePerAppointment || 0,
            currency: response.data.currency || "VND",
          },
        });
      } else {
        const errorMessage =
          response?.errMessage || "Đã xảy ra lỗi không xác định";
        this.setState({ error: errorMessage });
        toast.error(`Lỗi: ${errorMessage}`);
      }
    } catch (error) {
      console.error("fetchRevenueData error:", error);
      this.setState({ error: "Không thể tải dữ liệu doanh thu." });
      toast.error("Không thể tải dữ liệu doanh thu. Vui lòng thử lại.");
    } finally {
      this.setState({ isLoading: false });
    }
  };

  formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);

  // Tạo danh sách các năm (từ 2020 đến năm hiện tại)
  generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2020;
    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  };

  // Tạo danh sách các tháng trong năm hiện tại và các năm trước
  generateMonthOptions = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const startYear = 2020;
    const months = [];

    for (let year = currentYear; year >= startYear; year--) {
      const maxMonth = year === currentYear ? currentMonth : 12;
      for (let month = maxMonth; month >= 1; month--) {
        months.push({
          value: `${year}-${month.toString().padStart(2, "0")}`,
          label: `Tháng ${month}/${year}`,
        });
      }
    }
    return months;
  };

  render() {
    const { currentDate, revenueData, isLoading, error, filterType } =
      this.state;

    return (
      <div className="manage-revenue-container">
        <div className="revenue-header">Quản lý doanh thu</div>

        <div className="revenue-content">
          <div className="filter-controls">
            <label>Chọn loại lọc:</label>
            <select
              value={filterType}
              onChange={this.handleFilterTypeChange}
              className="form-control"
            >
              <option value="date">Theo ngày</option>
              <option value="month">Theo tháng</option>
              <option value="year">Theo năm</option>
            </select>

            <label>Chọn thời gian:</label>
            {filterType === "date" && (
              <DatePicker
                onChange={this.handleOnChangeDatePicker}
                className="form-control date-picker"
                value={currentDate}
                maxDate={new Date()}
              />
            )}

            {filterType === "month" && (
              <select
                value={moment(currentDate).format("YYYY-MM")}
                onChange={this.handleMonthChange}
                className="form-control"
              >
                {this.generateMonthOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {filterType === "year" && (
              <select
                value={moment(currentDate).year()}
                onChange={this.handleYearChange}
                className="form-control"
              >
                {this.generateYearOptions().map((year) => (
                  <option key={year} value={year}>
                    Năm {year}
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Đang tải dữ liệu doanh thu...</p>
            </div>
          ) : (
            <div className="revenue-stats">
              <div className="stat-card appointments">
                <div className="stat-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="stat-content">
                  <h3>{revenueData.totalAppointments}</h3>
                  <p>Tổng số lượt khám</p>
                </div>
              </div>

              <div className="stat-card revenue">
                <div className="stat-icon">
                  <i className="fas fa-money-bill-wave"></i>
                </div>
                <div className="stat-content">
                  <h3>{this.formatCurrency(revenueData.totalRevenue)}</h3>
                  <p>Tổng doanh thu</p>
                </div>
              </div>

              <div className="stat-card price-per">
                <div className="stat-icon">
                  <i className="fas fa-tag"></i>
                </div>
                <div className="stat-content">
                  <h3>
                    {this.formatCurrency(revenueData.pricePerAppointment)}
                  </h3>
                  <p>Giá mỗi lần khám</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.userInfo,
});

export default connect(mapStateToProps)(ManageRevenue);
