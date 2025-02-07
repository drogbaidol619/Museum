import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import exhibitions from "../contents/museum";
import "bootstrap-icons/font/bootstrap-icons.css";

// Hàm kiểm tra xem ngày có sự kiện hay không
function hasEvent(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return exhibitions.some((event) => {
    const eventDayOfWeek = event.days; // Thứ của ngày diễn ra sự kiện (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)
    for (let d = 1; d <= new Date(year, month + 1, 0).getDate(); d++) {
      const currentDate = new Date(year, month, d);
      if (
        currentDate.getDay() === eventDayOfWeek &&
        currentDate.getDate() === day
      )
        return true;
    }
    return false;
  });
}

// Hàm thêm lớp CSS cho các ô có sự kiện
function tileClassName({ date, view }) {
  if (view === "month" && hasEvent(date)) {
    return "CalendarCss text-black"; // Trả về lớp CSS nếu có sự kiện
  }
}

function MyApp() {
  const [value, onChange] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleDateChange = (date) => {
    onChange(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const foundEvent = exhibitions.find((event) => {
      const eventDayOfWeek = event.days;
      for (let d = 1; d <= new Date(year, month + 1, 0).getDate(); d++) {
        const currentDate = new Date(year, month, d);
        if (
          currentDate.getDay() === eventDayOfWeek &&
          currentDate.getDate() === day
        ) {
          return true;
        }
      }
      return false; // nếu không có sự kiện nào trùng
    });
    setSelectedEvent(foundEvent || null);
  };

  const [openTime, setOpenTime] = useState("9:30");
  function checkTime(event) {
    if (event.id === 4 || event.id === 5 || event.id === 6) {
      return "9:30 đến 17:00";
    } else if (event.id === 7 || event.id === 8 || event.id === 9) {
      return "9:30 đến 18:00";
    } else if (event.id === 13 || event.id === 14 || event.id === 15) {
      return "9:30 đến 17:00";
    } else if (event.id === 16 || event.id === 17 || event.id === 18) {
      return "9:30 đến 18:00";
    }
  }
  return (
    <div className="flex flex-col gap-11 items-center">
      <Calendar
        onChange={handleDateChange}
        value={value}
        className="rounded-md"
        tileClassName={tileClassName}
      />
      <div className="text-white  ">
        {selectedEvent && (
          <div className="text-lg font-bold">
            <i className="bi bi-calendar-check"></i> Triển Lãm mở cửa từ{" "}
            {checkTime(selectedEvent)}
          </div>
        )}
        {!selectedEvent && (
          <p className="text-lg font-bold">
            <i className="bi bi-calendar-check"></i> Không có sự kiện nào trong
            ngày này.
          </p>
        )}
      </div>
    </div>
  );
}
export default MyApp;
