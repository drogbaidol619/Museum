import { useState, React } from "react";
import "../App.css";
import Picture from "./Picture";
import exhibitions from "../contents/museum";
import Contents from "./LandingPageContents";
import MyApp from "./Calendar";

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
          <div className="flex flex-col gap-10 py-10 pl-8 ">
            <p className="underline text-white text-4xl font-bold">
              Today's information
            </p>
            <div className="grid grid-rows-3 text-white gap-4">
              {exhibitions.map(createContents)}
            </div>
          </div>
        </div>
        <div className="flex flex-col backdrop-blur-md gap-4 py-5 bg-stone-800 items-center rounded-md">
          <div className="roboto text-white text-2xl font-bold mb-3">
            Select a date in the calendar
          </div>
          <MyApp />
          <div className="text-white">Hello</div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
