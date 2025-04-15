import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import gallery from "../contents/Gallery";
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

const productsToDisplay = [];
for (let i = 0; i < 5; i++) {
  const index = (displayedCount + i) % gallery.length; // số bị chia nhỏ hơn số chia, kết quả của phép chia là chính số bị chia.
  productsToDisplay.push(gallery[index]);
}

displayedCount = (displayedCount + 5) % gallery.length;
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
        className="object-cover object-bottom max-h-screen rounded-md"
        src={firstProduct.image}
      ></img>
      <div className="roboto text-4xl font-normal flex flex-wrap gap-4 items-start">
        {firstProduct.title}{" "}
        <span className="px-3 py-2 bg-green-800 text-white text-lg rounded-md text-center">
          {firstProduct.type}
        </span>
      </div>
      <div className="roboto text-xl font-light text-justify">
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
        className="object-cover object-center max-h-screen rounded-md"
        src={secondProduct.image}
      ></img>
      <div className="roboto text-4xl font-normal flex flex-wrap gap-4 items-start">
        {secondProduct.title}{" "}
        <span className="px-3 py-2 bg-green-800 text-white text-lg rounded-md text-center">
          {secondProduct.type}
        </span>
      </div>
      <div className="roboto text-xl font-light text-justify">
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
    <div className="flex flex-col gap-4 flex-auto">
      <img
        className="object-cover object-center max-h-screen rounded-md"
        src={thirdProduct.image}
      ></img>
      <div className="roboto text-4xl font-normal flex flex-wrap gap-2 items-start">
        {thirdProduct.title}{" "}
        <span className="px-3 py-2 bg-green-800 text-white text-lg rounded-md text-center">
          {thirdProduct.type}
        </span>
      </div>
      <div className="roboto text-xl font-light text-justify">
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
    <div className="flex flex-col gap-4 flex-auto">
      <img
        className="object-cover object-center max-h-screen rounded-md"
        src={fourthProduct.image}
      ></img>
      <div className="roboto text-4xl font-normal flex flex-wrap items-start">
        {fourthProduct.title}{" "}
        <span className="px-3 py-2 bg-green-800 text-white text-lg rounded-md text-center">
          {fourthProduct.type}
        </span>
      </div>
      <div className="roboto text-xl font-light text-justify">
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
    <div className="flex flex-col gap-4 flex-auto">
      <img
        className="object-cover object-center max-h-screen rounded-md"
        src={fifthProduct.image}
      ></img>
      <div className="roboto text-4xl font-normal flex flex-wrap items-start">
        {fifthProduct.title}{" "}
        <span className="px-3 py-2 bg-green-800 text-white text-lg rounded-md text-center">
          {fifthProduct.type}
        </span>
      </div>
      <div className="roboto text-xl font-light text-justify">
        {fifthProduct.description}
      </div>
    </div>
  ) : (
    <div>Không có sản phẩm nào để hiển thị.</div>
  );

  return (
    <div className="bg-white min-w-screen max-h-fit pl-20 pr-14 pt-28 flex flex-col flex-auto">
      <h1 className="text-5xl font-normal roboto mb-10">Sự Kiện Nổi Bật</h1>
      <div className="grid grid-rows-2 gap-8 ">
        {/* Hàng 1 */}
        <div className="grid grid-cols-3 gap-6 max-h-fit">
          <div className="col-span-2 ">{firstGallery}</div>
          <div className="">{secondGallery}</div>
        </div>
        {/* Hàng 2 */}
        <div className="grid grid-cols-3 gap-6 max-h-fit pb-24">
          <div className="flex flex-col flex-auto">{thirdGallery}</div>
          <div className="flex flex-col flex-auto">{fourthGallery}</div>
          <div className="flex flex-col flex-auto">{fifthGallery}</div>
        </div>
      </div>
    </div>
  );
}
export default Highlight;
