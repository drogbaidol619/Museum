import { useState, React } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import SelectDrop from "./components/SelectDrop";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

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

  const [device, setDevice] = useState("null");
  const [data, setData] = useState([]);

  const handleDeviceClick = (deviceName) => {
    setDevice(deviceName); // Cập nhật state khi click
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/extract",
        {
          deviceSelect: device, // tên device
          startDate: day.start, // ngày trích xuất
          endDate: day.end, // ngày kết thúc trích xuất
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      setData(response.data); // Cập nhật state data với dữ liệu từ backend
      console.log(data);
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi trong quá trình trích xuất. Vui lòng thử lại.");
    }
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
              placeholder="Định dạng kiểu yyyy-mm-dd"
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
              placeholder="Định dạng kiểu yyyy-mm-dd"
              className="w-full p-2 rounded-md bg-white"
              value={day.end}
              onChange={(e) => setDay({ ...day, end: e.target.value })}
            />
            <button
              onClick={(e) => {
                handleExtract(e);
              }}
              className="flex justify-center items-center rounded-md bg-blue-600 text-white roboto text-xl mt-10 h-10 p-2"
            >
              Trích xuất dữ liệu
            </button>
          </form>
        </div>
        {/*Khung table*/}
        <table className="table-auto roboto text-center w-full border-separate border border-gray-400">
          <thead
            className=" text-xl font-medium"
            style={{ backgroundColor: "#68D69D", color: "#401D83" }}
          >
            <tr>
              <td className="border border-gray-400">Id</td>
              <td className="border border-gray-400">Name</td>
              <td className="border border-gray-400">Temperature</td>
              <td className="border border-gray-400">Humidity</td>
              <td className="border border-gray-400">Light</td>
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
                <td className="border border-gray-400">{item.name}</td>
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
      <Footer />
      <BackToTop onCheck={scrollToTop} />
    </div>
  );
}

export default DatabasePage;
