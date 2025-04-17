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
  const [checkBox, setCheckBox] = useState({
    temperature_alarm: false,
    humidity_alarm: false,
    light_alarm: false,
    //sensor_alarm: false,
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
        "/api/extract",
        {
          deviceSelect: device, // tên device
          startDate: day.start, // ngày trích xuất
          endDate: day.end, // ngày kết thúc trích xuất
          temperature_alarm: checkBox.temperature_alarm,
          humidity_alarm: checkBox.humidity_alarm,
          light_alarm: checkBox.light_alarm,
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
              {/* <div className="flex gap-4 p-2 bg-neutral-400">
                <input
                  type="checkbox"
                  name="sensor_alarm"
                  checked={checkBox.sensor_alarm}
                  onChange={(e) =>
                    setCheckBox({
                      ...checkBox,
                      sensor_alarm: e.target.checked,
                    })
                  }
                />
                <label htmlFor="sensor_alarm">Cảnh báo tác động</label>
              </div> */}
            </div>

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
        <div className="max-h-screen overflow-y-scroll w-full">
          <table className="table-auto roboto text-center w-full border-separate border border-gray-400 ">
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
      </div>
      <Footer />
      <BackToTop onCheck={scrollToTop} />
    </div>
  );
}

export default DatabasePage;
