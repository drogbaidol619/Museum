import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import "../App.css";
import museumlogo from "../assets/Museum-logo-removebg.png";
import museum from "../assets/museum.jpg";

const today = new Date();
const year = today.getFullYear();

function Footer() {
  return (
    <footer
      className="text-white min-w-screen max-h-fit pl-20 pr-14 pt-8"
      style={{ backgroundColor: "#6B4423" }}
    >
      <div className="grid grid-cols-2 pb-11 border-b-1 border-b-white">
        {/*Cột 1*/}
        <div className="flex flex-col flex-auto">
          <img
            className="object-contain max-w-80"
            src={museumlogo}
            alt="none"
          />
          <div className="roboto text-balance font-medium pl-5 flex flex-col gap-2">
            <p>
              <i className="bi bi-geo-alt"></i> 268 Lý Thường Kiệt, P. 14, Quận
              10, Tp. Hồ Chí Minh
            </p>
            <p>
              <i className="bi bi-telephone"></i> (+84)852030658 -
              (+84)2839856346
            </p>
            <p>
              <i className="bi bi-envelope-at"></i> truyenthongvietnam@gmail.com
            </p>
          </div>
        </div>
        {/*Cột 2*/}
        <div className="flex flex-col flex-auto gap-4">
          <img className="object-contain max-w-80" src={museum} alt="none" />
          <div className="roboto text-xl font-bold flex flex-col gap-4">
            <p>THEO DÕI CHÚNG TÔI</p>
            <div className="flex gap-8 flex-auto">
              <button
                style={{ cursor: "pointer" }}
                className="size-14 bg-red-500 rounded-4xl"
              >
                <i className="bi bi-youtube"></i>
              </button>
              <button
                style={{ cursor: "pointer", backgroundColor: "#0866ff" }}
                className="size-14 rounded-4xl"
              >
                <i className="bi bi-facebook"></i>
              </button>
              <button
                style={{ cursor: "pointer" }}
                className="size-14 bg-black rounded-4xl"
              >
                <i className="bi bi-twitter-x"></i>
              </button>
              <button
                style={{ cursor: "pointer" }}
                className="size-14 bg-red-500 rounded-4xl"
              >
                <i className="bi bi-pinterest"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="py-2 text-white roboto flex justify-center font-extralight text-sm">
        <p>
          Copyright © {year} Bảo tàng Việt Nam. All rights reserved. Design by
          HoangMinh.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
