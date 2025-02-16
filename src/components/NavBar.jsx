import Picture from "./Picture";
import museumLogo from "../assets/Museum-logo-removebg.png";
import { useState, React } from "react";
import "../App.css";
import { Link } from "react-router-dom";

function changeFont(event) {
  var id = event.target.id;
  // Tìm tất cả các phần tử có class "navButton button"
  const navButtons = document.querySelectorAll(".navButton button");
  const navTextButtons = document.querySelectorAll(".navTextButton .Text");
  if (id === "0") {
    navButtons.forEach((button) => {
      button.style.fontSize = "1.35em";
    });
    navTextButtons.forEach((buttonFont) => {
      buttonFont.style.fontSize = "1.3em";
    });
  } else if (id === "1") {
    navButtons.forEach((button) => {
      button.style.fontSize = "1.15em";
    });
    navTextButtons.forEach((buttonFont) => {
      buttonFont.style.fontSize = "1.1em";
    });
  } else if (id === "2") {
    navButtons.forEach((button) => {
      button.style.fontSize = "0.95em";
    });
    navTextButtons.forEach((buttonFont) => {
      buttonFont.style.fontSize = "0.9em";
    });
  }
}

const scrollToTop = (event) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Optional: For smooth scrolling
  });
};

function NavBar() {
  return (
    <nav className="max-h-48 w-full" style={{ backgroundColor: "#6B4423" }}>
      <div className="grid grid-cols-5 p-6 gap-4 object-contain">
        <div className="col-span-1 ">
          <Link style={{ cursor: "pointer" }} to="/">
            <Picture className="object-cover" url={museumLogo} alt="none" />
          </Link>
        </div>
        <div className="col-span-4 grid grid-rows-2 gap-2 text-white roboto">
          <div className="grid grid-cols-4">
            <div className="col-start-4 flex items-center navTextButton">
              <div className="Text mr-4">Front Size:</div>
              <button
                id="0"
                style={{ cursor: "pointer" }}
                onClick={changeFont}
                className="bg-neutral-950 rounded-sm text-white mr-2"
              >
                L
              </button>
              <button
                id="1"
                onClick={changeFont}
                style={{ cursor: "pointer" }}
                className="bg-neutral-950 rounded-sm text-white mr-2"
              >
                M
              </button>
              <button
                id="2"
                onClick={changeFont}
                style={{ cursor: "pointer" }}
                className="bg-neutral-950 rounded-sm text-white"
              >
                S
              </button>
            </div>
          </div>
          <div className="flex justify-around items-end navButton pb-2">
            <Link style={{ cursor: "pointer" }} to="/collections">
              Collections
            </Link>
            <Link style={{ cursor: "pointer" }} to="/tourguide">
              Tour Guide
            </Link>
            <Link style={{ cursor: "pointer" }} to="/about">
              About
            </Link>
            <Link style={{ cursor: "pointer" }} to="/login">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
