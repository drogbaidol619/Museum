import { useState, React } from "react";
import "../App.css";
import Picture from "./Picture";
import exhibitions from "../contents/museum";
import Contents from "./LandingPageContents";
import MyApp from "./Calendar";
import "bootstrap-icons/font/bootstrap-icons.css";

function createContents(content) {
  const currentDate = new Date().getDay();
  if (content.days === currentDate) {
    return (
      <Contents
        key={content.id}
        id={content.id}
        title={content.title}
        times={content.times}
        description={content.description}
      />
    );
  }
}

function LandingPage() {
  return (
    <div className="LandingPage min-w-screen min-h-screen bg-center">
      <div className="grid grid-cols-3 pl-12 pr-14 pt-20 max-w-screen gap-14">
        <div className="bg-stone-800 col-span-2 rounded-md">
          <div className="flex flex-col justify-items-center gap-10 py-10 px-8 ">
            <p className="underline text-white text-4xl font-extrabold roboto">
              Thông tin của ngày
            </p>
            <div className="grid grid-rows-3 text-white gap-4">
              {exhibitions.map(createContents)}
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
        <div className="flex flex-col gap-4 py-5 bg-stone-800 items-center rounded-md">
          <div className=" text-white text-2xl font-bold mb-3 roboto">
            Chọn một ngày trong lịch
          </div>
          <MyApp />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
