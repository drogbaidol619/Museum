import { useState, React } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function LogInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [action, setAction] = useState("Log In");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || (action === "Sign Up" && !email)) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    const endpoint =
      action === "Sign Up"
        ? "http://localhost:3000/signup"
        : "http://localhost:3000/login";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          ...(action === "Sign Up" ? { email } : {}),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
        return;
      }

      const data = await response.json();
      console.log(data);
      if (data.verified) {
        navigate("/"); // Người dùng có tồn tại
      } else {
        if (data.message === "User not found") {
          alert("Người dùng không tồn tại. Vui lòng đăng ký.");
        } else {
          alert(data.message || "Đăng nhập không thành công.");
        }
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center max-w-screen overflow-x-clip Login min-h-screen">
      <form className="bg-white text-black flex flex-col gap-8 px-8 py-10 roboto w-full max-w-xl">
        <div className="flex justify-center text-justify text-blue-900 text-4xl font-medium">
          {action}
        </div>
        {/*Khung input*/}
        <div className="flex flex-col gap-4 roboto justify-center">
          {/*Khung username*/}
          <div className="bg-neutral-200 p-4 rounded-md flex justify-between gap-4 text-lg">
            <i className="bi bi-person"></i>
            <input
              name="username"
              type="text"
              placeholder="Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
          </div>
          {/*Khung email*/}
          {action === "Log In" ? null : (
            <div className="bg-neutral-200 p-4 rounded-md flex justify-between gap-4 text-lg">
              <i className="bi bi-envelope-at"></i>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email@gmail.com"
                className="w-full"
              />
            </div>
          )}
          {/*Khung password*/}
          <div className="bg-neutral-200 p-4 rounded-md flex justify-between gap-4 text-lg">
            <i className="bi bi-lock"></i>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
              className="bi bi-eye"
            ></button>
          </div>
        </div>

        {/*Khung button*/}
        <div className="roboto flex gap-2">
          <p>Quên mật khẩu? </p>
          <button className="text-blue-800">Nhấn vào đây!</button>
        </div>

        <div className="roboto flex gap-20 text-white justify-center w-full">
          {/* Log In/Sign Up Button */}
          <button
            onClick={(e) => {
              handleSubmit(e);
            }}
            className={"bg-indigo-700 p-4 rounded-3xl w-full text-xl"}
          >
            {action === "Sign Up" ? "Sign Up" : "Log In"}
          </button>
        </div>

        {/* chuyển sang sign up */}
        {action === "Sign Up" ? null : (
          <div className="flex justify-center gap-2">
            <p>Chưa có tài khoản?</p>
            <button
              onClick={() => {
                setAction("Sign Up");
              }}
              className="text-blue-800"
            >
              Tạo mới!
            </button>
          </div>
        )}
        {/* chuyển sang Log in */}
        {action === "Log In" ? null : (
          <div className="flex justify-center gap-2">
            <p>Đã có tài khoản?</p>
            <button
              onClick={() => {
                setAction("Log In");
              }}
              className="text-blue-800"
            >
              Đăng nhập!
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default LogInPage;
