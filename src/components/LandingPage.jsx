import { useState, React } from "react";
import "../App.css";
import Picture from "./Picture";
import exhibitions from "../contents/museum";
import Contents from "./LandingPageContents";
import MyApp from "./Calendar";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";

function LandingPage() {
  const currentDate = new Date().getDay();

  // Tìm các sự kiện trong ngày
  const eventsToday = exhibitions.filter(
    (exhibition) => exhibition.days === currentDate
  );

  return (
    <div className="LandingPage min-w-screen min-h-screen bg-center">
      <div className="grid grid-cols-3 pl-12 pr-14 py-20 max-w-screen gap-14">
        <div className="bg-stone-800 col-span-2 rounded-md">
          <div className="flex flex-col flex-auto gap-10 py-10 px-8">
            <p className="underline text-white text-4xl font-extrabold roboto">
              Thông tin của ngày
            </p>
            <div className="grid grid-rows-3 text-white gap-2 min-h-56">
              {/* Kiểm tra nếu có sự kiện trong ngày */}
              {eventsToday.length > 0 ? (
                eventsToday.map((event) => (
                  <Contents
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    times={event.times}
                    description={event.description}
                  />
                ))
              ) : (
                <div className="grid grid-rows-2 border-l-4 border-l-indigo-500 pl-4 gap-2 roboto h-full">
                  <div className="text-lg font-bold roboto">
                    Bảo tàng hôm nay đóng cửa
                  </div>
                  <div className="text-base roboto">
                    Quý khách hãy quay lại vào hôm sau
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/tourguide"
              style={{ cursor: "pointer" }}
              className="flex justify-between items-center bg-white w-full h-12 text-lg font-bold px-8 py-6"
            >
              <h1 className="roboto text-2xl font-bold ">Đặt vé</h1>
              <i className="bi bi-cursor-fill"></i>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 py-5 bg-stone-800 items-center rounded-md min-w-[256px]">
          <div className=" text-white text-2xl font-bold mb-3 roboto text-center">
            Chọn một ngày trong lịch
          </div>
          <MyApp />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
