import { useState, React, useRef } from "react";
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
  TimeScale,
} from "chart.js";
import { registerables } from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  ...registerables
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

  const chartRef = useRef(null); // Tạo ref cho biểu đồ

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
      const data = response.data;
      setData(response.data.data); // Cập nhật state data với dữ liệu từ backend
      setTemperatureStats(response.data.temperatureStats);
      console.log("Data:", response.data.data);
      console.log("Temperature Stats:", response.data.temperatureStats);
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
      const chartIds = [
        "temperatureChart",
        "humidityChart",
        "lightChart",
        "motionChart",
      ];
      let yPosition = 10;

      for (let i = 0; i < chartIds.length; i++) {
        const chartElement = document.getElementById(chartIds[i]);
        if (chartElement) {
          const canvas = await html2canvas(chartElement, { scale: 2 });
          const imgData = canvas.toDataURL("image/png");
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(imgData, "PNG", 10, yPosition, pdfWidth, pdfHeight);
          yPosition += pdfHeight + 10;

          if (yPosition > 250 && i < chartIds.length - 1) {
            pdf.addPage();
            yPosition = 10;
          }
        }
      }

      pdf.save(`${device}_charts_${day.start}_${day.end}.pdf`);
      alert("Báo cáo biểu đồ đã được tải xuống thành công!");
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi trong quá trình xuất báo cáo. Vui lòng thử lại.");
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
        data: data.map((item) => (item.motion ? 1 : 0)), // Chuyển thành 1/0 để vẽ
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
      legend: { position: "top" },
      title: { display: true, text: (ctx) => ctx.chart.data.datasets[0].label },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: null, // Để Chart.js tự động xác định đơn vị
          tooltipFormat: "yyyy-MM-dd HH:mm:ss",
          displayFormats: {
            millisecond: "SSS",
            second: "HH:mm:ss",
            minute: "HH:mm",
            hour: "HH",
            day: "MM-dd",
            week: "MM-dd",
            month: "yyyy-MM",
            quarter: "yyyy-MM",
            year: "yyyy",
          },
        },
        title: { display: true, text: "Thời gian" },
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
              <table className="table-auto roboto text-center w-full border-separate border border-gray-400 ">
                <thead
                  className=" text-xl font-medium"
                  style={{ backgroundColor: "#68D69D", color: "#401D83" }}
                >
                  <tr>
                    <td className="border border-gray-400">Id</td>
                    <td className="border border-gray-400">Temperature</td>
                    <td className="border border-gray-400">Humidity</td>
                    <td className="border border-gray-400">Light</td>
                    <td className="border border-gray-400">Motion</td>
                    <td className="border border-gray-400">Ssid</td>
                    <td className="border border-gray-400">Time</td>
                    <td className="border border-gray-400">Date</td>
                  </tr>
                </thead>
                <tbody
                  className="text-balance font-normal"
                  style={{ backgroundColor: "#d0fbe1", color: "#005a9e" }}
                >
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-400">{index}</td>
                      <td className="border border-gray-400">
                        {item.temperature !== null ? item.temperature : "null"}
                      </td>
                      <td className="border border-gray-400">
                        {item.humidity !== null ? item.humidity : "null"}
                      </td>
                      <td className="border border-gray-400">
                        {item.light !== null ? item.light : "null"}
                      </td>
                      <td className="border border-gray-400">
                        {item.motion === true
                          ? "True"
                          : item.motion === false
                          ? "False"
                          : "N/A"}
                      </td>
                      <td className="border border-gray-400">
                        {item.ssid !== null ? item.ssid : "null"}
                      </td>
                      <td className="border border-gray-400">
                        {item.time !== null ? item.time : "null"}
                      </td>
                      <td className="border border-gray-400">
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
            <div className="flex flex-col gap-5 w-full">
              <h1 className="text-2xl font-bold mb-5">
                Bảng xem trước báo cáo biểu đồ
              </h1>
              <div className="flex flex-col overflow-x-auto">
                {/* Nhiệt độ */}
                <p className="text-xl font-semibold ">Biểu đồ nhiệt độ</p>
                <div className="flex flex-col gap-2 text-black">
                  <div className=" grid grid-cols-2 rounded-md p-5">
                    <div className="grid grid-rows-7 gap-1 border-r-2 border-gray-400">
                      <p className="border-b-2 border-gray-400">
                        Giá trị lớn nhất
                      </p>
                      <p className="border-b-2 border-gray-400">
                        Giá trị nhỏ nhất
                      </p>
                      <p className="border-b-2 border-gray-400">
                        Giá trị trung bình
                      </p>
                      <p className="border-b-2 border-gray-400">
                        Tổng các điểm giá trị
                      </p>
                      <p className="border-b-2 border-gray-400">
                        Thời điểm ghi nhận sớm nhất
                      </p>
                      <p className="border-b-2 border-gray-400">
                        Thời điểm ghi nhận muộn nhất
                      </p>
                      <p className="border-b-2 border-gray-400">
                        Khoảng thời gian ghi nhận
                      </p>
                      <p className="border-b-2 border-gray-400">
                        Độ chia thời gian
                      </p>
                    </div>
                    <div className="grid grid-rows-7 gap-1">
                      <p className="border-b-2 border-gray-400">
                        {temperatureStats.maxTemp !== null
                          ? `${temperatureStats.maxTemp}°C tại ${temperatureStats.maxTempTime}`
                          : "N/A"}
                      </p>
                      <p className="border-b-2 border-gray-400">
                        {temperatureStats.minTemp !== null
                          ? `${temperatureStats.minTemp}°C tại ${temperatureStats.minTempTime}`
                          : "N/A"}
                      </p>
                      <p className="border-b-2 border-gray-400">
                        {temperatureStats.avgTemp !== null
                          ? `${temperatureStats.avgTemp.toFixed(2)}°C`
                          : "N/A"}
                      </p>
                      <p className="border-b-2 border-gray-400">
                        {temperatureStats.totalPoints}
                      </p>
                      <p className="border-b-2 border-gray-400">
                        {temperatureStats.firstRecord}
                      </p>
                      <p className="border-b-2 border-gray-400">
                        {temperatureStats.lastRecord}
                      </p>
                      <p className="border-b-2 border-gray-400">
                        {temperatureStats.elapsedTime}
                      </p>
                      <p className="border-b-2 border-gray-400">
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
                <div
                  className="chart-container w-full min-h-[500px]"
                  id="humidityChart"
                >
                  <Line data={humidityData} options={chartOptions} />
                </div>
                <div
                  className="chart-container w-full min-h-[500px]"
                  id="lightChart"
                >
                  <Line data={lightData} options={chartOptions} />
                </div>
                <div
                  className="chart-container w-full min-h-[500px]"
                  id="motionChart"
                >
                  <Line data={motionData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <BackToTop onCheck={scrollToTop} />
    </div>
  );
}

export default DatabasePage;
