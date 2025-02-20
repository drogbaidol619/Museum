import { useState, React, use } from "react";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function LogInPage() {
  const [action, setAction] = useState("LogIn");

  return (
    <div className="flex flex-col justify-center items-center max-w-screen overflow-x-clip Login min-h-screen">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="bg-white text-black flex flex-col gap-8 px-8 py-10 roboto w-full max-w-xl"
      >
        <div className="flex justify-center text-justify text-blue-900 text-4xl font-medium underline underline-offset-8 decoration-blue-900 decoration-4">
          {action}
        </div>
        {/*Khung input*/}
        <div className="flex flex-col gap-4 roboto justify-center">
          {/*Khung username*/}
          <div className="bg-neutral-200 p-4 rounded-md flex justify-between gap-4 text-lg">
            <i className="bi bi-person"></i>
            <input type="text" placeholder="Name" className="w-full" />
          </div>
          {/*Khung email*/}
          {action === "LogIn" ? null : (
            <div className="bg-neutral-200 p-4 rounded-md flex justify-between gap-4 text-lg">
              <i className="bi bi-envelope-at"></i>
              <input type="email" placeholder="Email" className="w-full" />
            </div>
          )}

          {/*Khung password*/}
          <div className="bg-neutral-200 p-4 rounded-md flex justify-between gap-4 text-lg">
            <i className="bi bi-lock"></i>
            <input type="password" placeholder="Password" className="w-full" />
          </div>
        </div>
        {/*Khung button*/}
        <div className="roboto flex gap-2">
          <p>Quên mật khẩu? </p>
          <button className="text-blue-800">Nhấn vào đây!</button>
        </div>
        {/*Sign Up*/}
        <div className="roboto flex gap-20 text-white justify-center w-full">
          <button
            onClick={() => {
              setAction("Sign Up");
            }}
            className={
              action === "LogIn"
                ? "p-4 rounded-3xl w-full bg-neutral-300 text-black"
                : "bg-indigo-700 p-4 rounded-3xl w-full"
            }
          >
            Sign Up
          </button>
          {/*LogIn*/}
          <button
            onClick={() => {
              setAction("LogIn");
            }}
            className={
              action === "Sign Up"
                ? "p-4 rounded-3xl w-full bg-neutral-300 text-black"
                : "bg-indigo-700 p-4 rounded-3xl w-full"
            }
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}

export default LogInPage;
