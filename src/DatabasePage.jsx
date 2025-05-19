import { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import SelectDrop from "./components/SelectDrop";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import moment from "moment";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const scrollToTop = (event) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Optional: For smooth scrolling
  });
};

function DatabasePage() {
  const [day, setDay] = useState({
    start: "",
    end: "",
  });
  const [checkBox, setCheckBox] = useState({
    temperature_alarm: false,
    humidity_alarm: false,
    light_alarm: false,
    motion_alarm: false,
  });

  const [device, setDevice] = useState("null");
  const [data, setData] = useState([]);
  const [temperatureStats, setTemperatureStats] = useState({
    maxTemp: null,
    maxTempTime: "N/A",
    minTemp: null,
    minTempTime: "N/A",
    avgTemp: null,
    totalPoints: 0,
    firstRecord: "N/A",
    lastRecord: "N/A",
    elapsedTime: "N/A",
    groupingInterval: "N/A",
  });
  const [humidityStats, setHumidityStats] = useState({
    maxHumidity: null,
    minHumidity: null,
    avgHumidity: null,
  });
  const [lightStats, setLightStats] = useState({
    maxLight: null,
    minLight: null,
    avgLight: null,
  });
  const [motionStats, setMotionStats] = useState({
    motionCount: 0,
  });

  const handleDeviceClick = (deviceName) => {
    setDevice(deviceName); // Cập nhật state khi click
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/extract",
        {
          deviceSelect: device, // tên device
          startDate: day.start, // ngày trích xuất
          endDate: day.end, // ngày kết thúc trích xuất
          temperature_alarm: checkBox.temperature_alarm,
          humidity_alarm: checkBox.humidity_alarm,
          light_alarm: checkBox.light_alarm,
          motion_alarm: checkBox.motion_alarm,
        },
        {
          withCredentials: true,
        }
      );
      const extractedData = response.data.data;
      setData(extractedData);
      setTemperatureStats(response.data.temperatureStats);
      setHumidityStats(response.data.humidityStats);
      setLightStats(response.data.lightStats);
      setMotionStats(response.data.motionStats);

      // Tính toán khoảng thời gian trung bình dựa trên điểm đầu và cuối
      if (extractedData.length >= 2) {
        const firstTime = moment(
          `${extractedData[0].date} ${extractedData[0].time}`,
          "YYYY-MM-DD HH:mm:ss"
        );
        const lastTime = moment(
          `${extractedData[extractedData.length - 1].date} ${
            extractedData[extractedData.length - 1].time
          }`,
          "YYYY-MM-DD HH:mm:ss"
        );

        if (firstTime.isValid() && lastTime.isValid()) {
          const totalDifferenceMs = lastTime.valueOf() - firstTime.valueOf();
          const totalPoints = extractedData.length;
          const averageDifferenceMs =
            totalPoints > 1 ? totalDifferenceMs / (totalPoints - 1) : 0;

          let groupingInterval = "N/A";
          if (averageDifferenceMs > 0 && averageDifferenceMs !== Infinity) {
            const duration = moment.duration(averageDifferenceMs);
            const days = duration.days();
            const hours = duration.hours();
            const minutes = duration.minutes();
            const seconds = duration.seconds();

            const parts = [];
            if (days > 0) parts.push(`${days} ngày`);
            if (hours > 0) parts.push(`${hours} giờ`);
            if (minutes > 0) parts.push(`${minutes} phút`);
            if (seconds >= 0 && parts.length === 0)
              parts.push(`${seconds} giây`);
            else if (seconds > 0 && parts.length > 0)
              parts.push(`${seconds} giây`);

            groupingInterval = parts.join(", ") || "0 giây";
          }

          setTemperatureStats((prevStats) => ({
            ...prevStats,
            groupingInterval,
          }));
        } else {
          setTemperatureStats((prevStats) => ({
            ...prevStats,
            groupingInterval: "Lỗi định dạng thời gian đầu hoặc cuối",
          }));
        }
      } else if (extractedData.length === 1) {
        setTemperatureStats((prevStats) => ({
          ...prevStats,
          groupingInterval: "Dữ liệu đơn lẻ",
        }));
      } else {
        setTemperatureStats((prevStats) => ({
          ...prevStats,
          groupingInterval: "Không có dữ liệu",
        }));
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi trong quá trình trích xuất. Vui lòng thử lại.");
    }
  };

  const handleExcel = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/csv",
        {
          deviceSelect: device, // tên device
          startDate: day.start, // ngày trích xuất
          endDate: day.end, // ngày kết thúc trích xuất
          temperature_alarm: checkBox.temperature_alarm,
          humidity_alarm: checkBox.humidity_alarm,
          light_alarm: checkBox.light_alarm,
          motion_alarm: checkBox.motion_alarm,
        },
        {
          responseType: "blob", // Chỉ giữ responseType: "blob" để nhận file
        }
      );

      // Tạo URL từ blob và tự động tải file
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "text/csv" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${device}_${day.start}_${day.end}.csv`); // Tên file
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log("File CSV downloaded successfully");
      alert("File CSV đã được tải xuống thành công!");
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi trong quá trình xuất CSV. Vui lòng thử lại.");
    }
  };

  const handleExportCharts = async (e) => {
    e.preventDefault();
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      let yPosition = 10;
      const margin = 10;
      const chartWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
      // Ước tính chiều cao bao gồm cả tiêu đề
      const titleHeight = 10;
      const statsHeight = 70; // Điều chỉnh nếu cần
      const chartHeight = 150; // Điều chỉnh nếu cần

      const elementsToCapture = [
        {
          id: "reportTitle",
          label: "Bảng xem trước báo cáo biểu đồ",
          height: titleHeight,
          type: "title",
        },
        {
          id: "temperatureChartTitle",
          label: "Biểu đồ nhiệt độ",
          height: titleHeight,
          type: "title",
        },
        {
          id: "temperatureStats",
          label: "Thống kê nhiệt độ",
          height: statsHeight,
        },
        {
          id: "temperatureChart",
          label: "Biểu đồ nhiệt độ",
          height: chartHeight,
        },
        {
          id: "humidityChartTitle",
          label: "Biểu đồ độ ẩm",
          height: titleHeight,
          type: "title",
        },
        { id: "humidityStats", label: "Thống kê độ ẩm", height: statsHeight },
        { id: "humidityChart", label: "Biểu đồ độ ẩm", height: chartHeight },
        {
          id: "lightChartTitle",
          label: "Biểu đồ ánh sáng",
          height: titleHeight,
          type: "title",
        },
        { id: "lightStats", label: "Thống kê ánh sáng", height: statsHeight },
        { id: "lightChart", label: "Biểu đồ ánh sáng", height: chartHeight },
        {
          id: "motionChartTitle",
          label: "Biểu đồ chuyển động",
          height: titleHeight,
          type: "title",
        },
        {
          id: "motionStats",
          label: "Thống kê chuyển động",
          height: statsHeight,
        },
        {
          id: "motionChart",
          label: "Biểu đồ chuyển động",
          height: chartHeight,
        },
      ];

      for (const elementInfo of elementsToCapture) {
        const element = document.getElementById(elementInfo.id);
        if (element) {
          if (
            yPosition + elementInfo.height >
            pdf.internal.pageSize.getHeight() - margin
          ) {
            pdf.addPage();
            yPosition = margin;
          }

          const canvas = await html2canvas(element, { scale: 2 });
          const imgData = canvas.toDataURL("image/png");
          pdf.addImage(
            imgData,
            "PNG",
            margin,
            yPosition,
            chartWidth,
            elementInfo.height
          );
          yPosition += elementInfo.height + margin;
        } else {
          console.warn(`Không tìm thấy phần tử với ID: ${elementInfo.id}`);
        }
      }

      pdf.save(`${device}_report_${day.start}_${day.end}.pdf`);
      alert("Báo cáo biểu đồ và thống kê đã được tải xuống thành công!");
    } catch (error) {
      console.error(error);
      alert(
        "Đã xảy ra lỗi trong quá trình xuất báo cáo biểu đồ. Vui lòng thử lại."
      );
    }
  };

  // Chuẩn bị dữ liệu cho biểu đồ
  const labels = data.map((item) => `${item.date} ${item.time}`); // Trục x: thời gian

  const temperatureData = {
    labels,
    datasets: [
      {
        label: "Nhiệt độ (°C)",
        data: data.map((item) => item.temperature),
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.3,
      },
    ],
  };

  const humidityData = {
    labels,
    datasets: [
      {
        label: "Độ ẩm (%)",
        data: data.map((item) => item.humidity),
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.3,
      },
    ],
  };

  const lightData = {
    labels,
    datasets: [
      {
        label: "Ánh sáng (lux)",
        data: data.map((item) => item.light),
        fill: true,
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        tension: 0.3,
      },
    ],
  };

  const motionData = {
    labels,
    datasets: [
      {
        label: "Chuyển động",
        data: data.map((item) => (item.motion ? 1 : 0)),
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: (ctx) => ctx.chart.data.datasets[0].label,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Thời gian",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: (ctx) => ctx.chart.data.datasets[0].label,
        },
      },
    },
  };

  return (
    <div className="flex flex-col max-w-screen overflow-x-clip">
      <NavBar />
      {/*Khung nội dung */}
      <div className="flex gap-5 pl-12 pr-14 py-10 bg-gray-200">
        {/*Khung lựa chọn thiết bị */}
        <div className="flex flex-col gap-10 min-w-fit">
          <SelectDrop HandleClick={handleDeviceClick} />
          <form className="bg-gray-200 text-black flex flex-col roboto w-full rounded-md">
            <p className="w-full pl-2 py-2  font-medium text-xl">
              Nhập ngày bắt đầu
            </p>
            <input
              type="text"
              name="start"
              placeholder="Định dạng yyyy-mm-dd"
              className="w-full p-2 rounded-md bg-white"
              value={day.start}
              onChange={(e) => setDay({ ...day, start: e.target.value })}
            />
            <p className="w-full pl-2 py-2  font-medium text-xl mt-4">
              Nhập ngày kết thúc
            </p>
            <input
              type="text"
              name="end"
              placeholder="Định dạng yyyy-mm-dd"
              className="w-full p-2 rounded-md bg-white"
              value={day.end}
              onChange={(e) => setDay({ ...day, end: e.target.value })}
            />
            {/*Khung checkbox */}
            <div className="flex flex-col mt-5">
              <p className="w-full pl-2 py-2  font-medium text-xl roboto">
                Lọc dữ liệu cảnh báo
              </p>
              <div className="flex gap-4 p-2 bg-neutral-400">
                <input
                  type="checkbox"
                  name="temperature_alarm"
                  checked={checkBox.temperature_alarm}
                  onChange={(e) =>
                    setCheckBox({
                      ...checkBox,
                      temperature_alarm: e.target.checked,
                    })
                  }
                />
                <label htmlFor="temperature_alarm">Cảnh báo nhiệt độ</label>
              </div>
              <div className="flex gap-4 p-2 bg-neutral-400">
                <input
                  type="checkbox"
                  name="humidity_alarm"
                  checked={checkBox.humidity_alarm}
                  onChange={(e) =>
                    setCheckBox({
                      ...checkBox,
                      humidity_alarm: e.target.checked,
                    })
                  }
                />
                <label htmlFor="humidity_alarm">Cảnh báo độ ẩm</label>
              </div>
              <div className="flex gap-4 p-2 bg-neutral-400">
                <input
                  type="checkbox"
                  name="light_alarm"
                  checked={checkBox.light_alarm}
                  onChange={(e) =>
                    setCheckBox({
                      ...checkBox,
                      light_alarm: e.target.checked,
                    })
                  }
                />
                <label htmlFor="light_alarm">Cảnh báo ánh sáng</label>
              </div>
              <div className="flex gap-4 p-2 bg-neutral-400">
                <input
                  type="checkbox"
                  name="motion_alarm"
                  checked={checkBox.motion_alarm}
                  onChange={(e) =>
                    setCheckBox({
                      ...checkBox,
                      motion_alarm: e.target.checked,
                    })
                  }
                />
                <label htmlFor="motion_alarm">Cảnh báo tác động</label>
              </div>
            </div>
            {/*Nút trích xuất dữ liệu */}
            <button
              onClick={(e) => {
                handleExtract(e);
              }}
              className="flex justify-center items-center rounded-md bg-blue-600 text-white roboto text-xl mt-10 h-10 p-2"
            >
              Trích xuất dữ liệu
            </button>
            <button
              onClick={(e) => {
                handleExcel(e);
              }}
              className="flex justify-center items-center rounded-md bg-green-500 text-white roboto text-xl mt-10 h-10 p-2"
            >
              Xuất excel
            </button>
            <button
              onClick={(e) => {
                handleExportCharts(e);
              }}
              className="flex justify-center items-center rounded-md bg-green-500 text-white roboto text-xl mt-10 h-10 p-2"
            >
              Xuất báo cáo biểu đồ
            </button>
          </form>
        </div>

        {/* Báo cáo*/}
        <div className="flex flex-col gap-10 w-full">
          {/*Khung table*/}
          {data.length > 0 && (
            <div className="col-span-2 max-h-screen overflow-y-scroll w-full">
              <table className="table-auto roboto text-center w-full border-separate border  ">
                <thead
                  className=" text-xl font-medium"
                  style={{ backgroundColor: "#68D69D", color: "#401D83" }}
                >
                  <tr>
                    <td className="border ">Id</td>
                    <td className="border ">Temperature</td>
                    <td className="border ">Humidity</td>
                    <td className="border ">Light</td>
                    <td className="border ">Motion</td>
                    <td className="border ">Ssid</td>
                    <td className="border ">Time</td>
                    <td className="border ">Date</td>
                  </tr>
                </thead>
                <tbody
                  className="text-balance font-normal"
                  style={{ backgroundColor: "#d0fbe1", color: "#005a9e" }}
                >
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="border ">{index}</td>
                      <td className="border ">
                        {item.temperature !== null ? item.temperature : "null"}
                      </td>
                      <td className="border ">
                        {item.humidity !== null ? item.humidity : "null"}
                      </td>
                      <td className="border ">
                        {item.light !== null ? item.light : "null"}
                      </td>
                      <td className="border ">
                        {item.motion === true
                          ? "True"
                          : item.motion === false
                          ? "False"
                          : "N/A"}
                      </td>
                      <td className="border ">
                        {item.ssid !== null ? item.ssid : "null"}
                      </td>
                      <td className="border ">
                        {item.time !== null ? item.time : "null"}
                      </td>
                      <td className="border ">
                        {item.date !== null ? item.date : "null"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Biểu đồ */}
          {data.length > 0 && (
            <div className="flex flex-col gap-5 w-full" id="reportPreview">
              <h1 className="text-2xl font-bold mb-5" id="reportTitle">
                Bảng xem trước báo cáo biểu đồ
              </h1>
              <div className="flex flex-col overflow-x-auto">
                {/* Nhiệt độ */}
                <p className="text-xl font-semibold" id="temperatureChartTitle">
                  Biểu đồ nhiệt độ
                </p>
                <div className="flex flex-col gap-2 text-black">
                  <div
                    className=" grid grid-cols-2 rounded-md p-5"
                    id="temperatureStats"
                  >
                    <div className="grid grid-rows-7 gap-1 border-r-2 ">
                      <p className="border-b-2 pl-2 pb-2 ">Giá trị lớn nhất</p>
                      <p className="border-b-2 pl-2 pb-2 ">Giá trị nhỏ nhất</p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Giá trị trung bình
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Tổng các điểm giá trị
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Thời điểm ghi nhận sớm nhất
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Thời điểm ghi nhận muộn nhất
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Khoảng thời gian ghi nhận
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Khoảng thời gian giữa các lần ghi nhận
                      </p>
                    </div>
                    <div className="grid grid-rows-7 gap-1">
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.maxTemp !== null
                          ? `${temperatureStats.maxTemp}°C tại ${temperatureStats.maxTempTime}`
                          : "N/A"}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.minTemp !== null
                          ? `${temperatureStats.minTemp}°C tại ${temperatureStats.minTempTime}`
                          : "N/A"}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.avgTemp !== null
                          ? `${temperatureStats.avgTemp.toFixed(2)}°C`
                          : "N/A"}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.totalPoints}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.firstRecord}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.lastRecord}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.elapsedTime}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.groupingInterval}
                      </p>
                    </div>
                  </div>
                  <div
                    className="chart-container w-full min-h-[500px]"
                    id="temperatureChart"
                  >
                    <Line data={temperatureData} options={chartOptions} />
                  </div>
                </div>
                {/* Độ ẩm */}
                <p
                  className="text-xl font-semibold mt-10"
                  id="humidityChartTitle"
                >
                  Biểu đồ độ ẩm
                </p>
                <div className="flex flex-col gap-2 text-black">
                  <div
                    className=" grid grid-cols-2 rounded-md p-5"
                    id="humidityStats"
                  >
                    <div className="grid grid-rows-7 gap-1 border-r-2 ">
                      <p className="border-b-2 pl-2 pb-2 ">Giá trị lớn nhất</p>
                      <p className="border-b-2 pl-2 pb-2 ">Giá trị nhỏ nhất</p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Giá trị trung bình
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Tổng các điểm giá trị
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Thời điểm ghi nhận sớm nhất
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Thời điểm ghi nhận muộn nhất
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Khoảng thời gian ghi nhận
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Thời gian giữa 2 lần ghi nhận
                      </p>
                    </div>
                    <div className="grid grid-rows-7 gap-1">
                      <p className="border-b-2 pl-2 pb-2 ">
                        {humidityStats.maxHumidity !== null
                          ? `${humidityStats.maxHumidity}%`
                          : "N/A"}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {humidityStats.minHumidity !== null
                          ? `${humidityStats.minHumidity}%`
                          : "N/A"}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {humidityStats.avgHumidity !== null
                          ? `${humidityStats.avgHumidity?.toFixed(2)}%`
                          : "N/A"}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.totalPoints}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.firstRecord}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.lastRecord}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.elapsedTime}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.groupingInterval}
                      </p>
                    </div>
                  </div>
                  <div
                    className="chart-container w-full min-h-[500px]"
                    id="humidityChart"
                  >
                    <Line data={humidityData} options={chartOptions} />
                  </div>
                </div>
                {/* Ánh sáng */}
                <p className="text-xl font-semibold mt-10" id="lightChartTitle">
                  Biểu đồ ánh sáng
                </p>
                <div className="flex flex-col gap-2 text-black">
                  <div
                    className=" grid grid-cols-2 rounded-md p-5"
                    id="lightStats"
                  >
                    <div className="grid grid-rows-7 gap-1 border-r-2 ">
                      <p className="border-b-2 pl-2 pb-2 ">Giá trị lớn nhất</p>
                      <p className="border-b-2 pl-2 pb-2 ">Giá trị nhỏ nhất</p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Giá trị trung bình
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Tổng các điểm giá trị
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Thời điểm ghi nhận sớm nhất
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Thời điểm ghi nhận muộn nhất
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Khoảng thời gian ghi nhận
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Thời gian giữa 2 lần ghi nhận
                      </p>
                    </div>
                    <div className="grid grid-rows-7 gap-1">
                      <p className="border-b-2 pl-2 pb-2 ">
                        {lightStats.maxLight !== null
                          ? `${lightStats.maxLight} lux`
                          : "N/A"}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {lightStats.minLight !== null
                          ? `${lightStats.minLight} lux`
                          : "N/A"}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {lightStats.avgLight !== null
                          ? `${lightStats.avgLight?.toFixed(2)} lux`
                          : "N/A"}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.totalPoints}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.firstRecord}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.lastRecord}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.elapsedTime}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.groupingInterval}
                      </p>
                    </div>
                  </div>
                  <div
                    className="chart-container w-full min-h-[500px]"
                    id="lightChart"
                  >
                    <Line data={lightData} options={chartOptions} />
                  </div>
                </div>

                {/* Chuyển động */}
                <p
                  className="text-xl font-semibold mt-10"
                  id="motionChartTitle"
                >
                  Biểu đồ chuyển động
                </p>
                <div className="flex flex-col gap-2 text-black">
                  <div
                    className=" grid grid-cols-2 rounded-md p-5"
                    id="motionStats"
                  >
                    <div className="grid grid-rows-6 gap-1 border-r-2 ">
                      <p className="border-b-2 pl-2 pb-2 ">
                        Tổng số lần phát hiện chuyển động
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Tổng các điểm giá trị
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Thời điểm ghi nhận sớm nhất
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Thời điểm ghi nhận muộn nhất
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Khoảng thời gian ghi nhận
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        Thời gian giữa 2 lần ghi nhận
                      </p>
                    </div>
                    <div className="grid grid-rows-6 gap-1">
                      <p className="border-b-2 pl-2 pb-2 ">
                        {motionStats.motionCount !== null
                          ? `${motionStats.motionCount} lần`
                          : "N/A"}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.totalPoints}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.firstRecord}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.lastRecord}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.elapsedTime}
                      </p>
                      <p className="border-b-2 pl-2 pb-2 ">
                        {temperatureStats.groupingInterval}
                      </p>
                    </div>
                  </div>
                  <div
                    className="chart-container w-full min-h-[500px]"
                    id="motionChart"
                  >
                    <Line data={motionData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Hết*/}
        </div>
      </div>
      <Footer />
      <BackToTop onCheck={scrollToTop} />
    </div>
  );
}

export default DatabasePage;
