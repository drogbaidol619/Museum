import { useState, React } from "react";
import "./App.css";
import Picture from "./components/Picture";
import museumLogo from "./assets/museum-logo.png";

function App() {
  return (
    <nav
      className="fixed top-0 min-h-24 w-full "
      style={{ backgroundColor: "#ffe5dc" }}
    >
      <div className="grid grid-cols-5 p-6 gap-4 object-contain">
        <div className="col-span-1 ">
          <Picture className="object-cover" url={museumLogo} alt="none" />
        </div>
        <div className="col-span-4 grid grid-rows-3 gap-2">
          <div className="grid grid-cols-4">
            <div className="col-start-4 flex items-center navTextButton">
              <div className="Text mr-4">Front Size:</div>
              <button className="bg-neutral-950 rounded-sm text-white mr-2">
                L
              </button>
              <button className="bg-neutral-950 rounded-sm text-white mr-2">
                M
              </button>
              <button className="bg-neutral-950 rounded-sm text-white">
                S
              </button>
            </div>
          </div>
          <div className="row-span-2 items-end justify-items-center grid grid-cols-4 navButton">
            <button className="">Collections</button>
            <button className="">Tour Guide</button>
            <button className="">Visit ticket</button>
            <button className="">About</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default App;
