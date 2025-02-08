import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import gallery from "../contents/Gallery";
import Picture from "./Picture";
import "../App.css";

let currentDay = localStorage.getItem("currentDay");
let displayedCount = localStorage.getItem("displayedCount");

const today = new Date().toLocaleDateString();

if (currentDay !== today) {
  currentDay = today;
  displayedCount = 0;
  localStorage.setItem("currentDay", currentDay);
  localStorage.setItem("displayedCount", displayedCount);
}

const productsToDisplay = gallery.slice(displayedCount, displayedCount + 5);
displayedCount += 5;

if (displayedCount >= gallery.length) {
  displayedCount = 0;
}

localStorage.setItem("displayedCount", displayedCount);

function Highlight() {
  // sản phẩm 1
  let firstProduct = null;

  if (productsToDisplay.length > 0) {
    firstProduct = productsToDisplay.find(
      (artwork) => artwork.id === productsToDisplay[0].id
    );
  }

  const firstGallery = firstProduct ? (
    <div className="flex flex-col gap-4">
      <img
        className="object-cover max-h-screen rounded-md"
        src={firstProduct.image}
      ></img>
      <div className="roboto text-4xl font-normal flex gap-4 items-start">
        {firstProduct.title}{" "}
        <span className="px-3 py-2 bg-green-800 text-white text-lg rounded-md">
          {firstProduct.type}
        </span>
      </div>
      <div className="roboto text-xl font-extralight text-justify">
        {firstProduct.description}
      </div>
    </div>
  ) : (
    <div>Không có sản phẩm nào để hiển thị.</div>
  );

  // sản phẩm 2
  let secondProduct = null;

  if (productsToDisplay.length > 0) {
    secondProduct = productsToDisplay.find(
      (artwork) => artwork.id === productsToDisplay[1].id
    );
  }

  const secondGallery = secondProduct ? (
    <div className="flex flex-col gap-4">
      <img
        className="object-cover max-h-screen rounded-md"
        src={secondProduct.image}
      ></img>
      <div className="roboto text-4xl font-normal flex gap-4 items-start">
        {secondProduct.title}{" "}
        <span className="px-3 py-2 bg-green-800 text-white text-lg rounded-md">
          {secondProduct.type}
        </span>
      </div>
      <div className="roboto text-xl font-extralight text-justify">
        {secondProduct.description}
      </div>
    </div>
  ) : (
    <div>Không có sản phẩm nào để hiển thị.</div>
  );

  // sản phẩm 3
  let thirdProduct = null;

  if (productsToDisplay.length > 0) {
    thirdProduct = productsToDisplay.find(
      (artwork) => artwork.id === productsToDisplay[2].id
    );
  }

  const thirdGallery = thirdProduct ? (
    <div className="flex flex-col gap-4">
      <img
        className="object-cover max-h-screen rounded-md"
        src={thirdProduct.image}
      ></img>
      <div className="roboto text-4xl font-normal flex gap-2 items-start">
        {thirdProduct.title}{" "}
        <span className="px-3 py-2 bg-green-800 text-white text-lg rounded-md">
          {thirdProduct.type}
        </span>
      </div>
      <div className="roboto text-xl font-extralight text-justify">
        {thirdProduct.description}
      </div>
    </div>
  ) : (
    <div>Không có sản phẩm nào để hiển thị.</div>
  );

  // sản phẩm 4
  let fourthProduct = null;

  if (productsToDisplay.length > 0) {
    fourthProduct = productsToDisplay.find(
      (artwork) => artwork.id === productsToDisplay[3].id
    );
  }

  const fourthGallery = fourthProduct ? (
    <div className="flex flex-col gap-4">
      <img
        className="object-cover max-h-screen rounded-md"
        src={fourthProduct.image}
      ></img>
      <div className="roboto text-4xl font-normal flex items-start">
        {fourthProduct.title}{" "}
        <span className="px-3 py-2 bg-green-800 text-white text-lg rounded-md">
          {fourthProduct.type}
        </span>
      </div>
      <div className="roboto text-xl font-extralight text-justify">
        {fourthProduct.description}
      </div>
    </div>
  ) : (
    <div>Không có sản phẩm nào để hiển thị.</div>
  );

  // sản phẩm 5
  let fifthProduct = null;

  if (productsToDisplay.length > 0) {
    fifthProduct = productsToDisplay.find(
      (artwork) => artwork.id === productsToDisplay[4].id
    );
  }

  const fifthGallery = fifthProduct ? (
    <div className="flex flex-col gap-4">
      <img
        className="object-cover max-h-screen rounded-md"
        src={fifthProduct.image}
      ></img>
      <div className="roboto text-4xl font-normal flex items-start">
        {fifthProduct.title}{" "}
        <span className="px-3 py-2 bg-green-800 text-white text-lg rounded-md">
          {fifthProduct.type}
        </span>
      </div>
      <div className="roboto text-xl font-extralight text-justify">
        {fifthProduct.description}
      </div>
    </div>
  ) : (
    <div>Không có sản phẩm nào để hiển thị.</div>
  );

  return (
    <div className="bg-white min-w-screen min-h-screen pl-20 pr-14 pt-28 flex flex-col">
      <h1 className="text-5xl font-bold roboto mb-10">Sự Kiện Nổi Bật</h1>
      <div className="grid grid-rows-2 gap-8">
        {/* Hàng 1 */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 ">{firstGallery}</div>
          <div className="">{secondGallery}</div>
        </div>
        {/* Hàng 2 */}
        <div className="grid grid-cols-3 gap-6">
          <div className="">{thirdGallery}</div>
          <div className="">{fourthGallery}</div>
          <div className="">{fifthGallery}</div>
        </div>
      </div>
    </div>
  );
}
export default Highlight;
