import { useState, React } from "react";
import "../App.css";
import Picture from "./Picture";
import exhibitions from "../contents/museum";
import Contents from "./LandingPageContents";
import MyApp from "./Calendar";
import "bootstrap-icons/font/bootstrap-icons.css";

function LandingPage() {
  const currentDate = new Date().getDay();

  // Tìm sự kiện trong ngày
  const eventToday = exhibitions.find(
    (exhibition) => exhibition.days === currentDate
  );

  return (
    <div className="LandingPage min-w-screen min-h-screen bg-center">
      <div className="grid grid-cols-3 pl-12 pr-14 pt-20 max-w-screen gap-14">
        <div className="bg-stone-800 col-span-2 rounded-md">
          <div className="flex flex-col flex-auto gap-10 py-10 px-8">
            <p className="underline text-white text-4xl font-extrabold roboto">
              Thông tin của ngày
            </p>
            <div className="grid grid-rows-3 text-white gap-4 min-h-56">
              {/* Kiểm tra nếu có sự kiện trong ngày */}
              {eventToday ? (
                <Contents
                  key={eventToday.id}
                  id={eventToday.id}
                  title={eventToday.title}
                  times={eventToday.times}
                  description={eventToday.description}
                />
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
            <button
              style={{ cursor: "pointer" }}
              className="flex justify-between items-center bg-white w-full h-12 text-lg font-bold px-8 py-6"
            >
              <h1 className="roboto text-2xl font-bold ">Đặt vé</h1>
              <i className="bi bi-cursor-fill"></i>
            </button>
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
