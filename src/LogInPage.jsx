import { useState, React } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function LogInPage() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [formState, setFormState] = useState("idle"); // 'idle', 'loginSuccess', 'signupSuccess', 'error'
  const [admin, setAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [action, setAction] = useState("Log In");
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    if (!email.includes("@")) {
      setEmailError("Email phải chứa ký tự @");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  {
    /*Login fetch */
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    setFormState("loading"); // Đang tải
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setFormState("errorFetch"); // Lỗi
        alert(errorData.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
        return;
      }

      const data = await response.json();
      console.log(data);
      if (!data.verified && data.message === "Incorrect Password") {
        setFormState("errorPassword"); // Lỗi sai mật khẩu
      } else if (!data.verified && data.message === "User not found") {
        setFormState("errorAccountNotExist"); // Lỗi tài khoản chưa tồn tại
      } else if (data.verified) {
        const isAdmin = data.admin || false; // Lấy giá trị admin hoặc false nếu không có
        setAdmin(isAdmin);
        localStorage.setItem("isAdmin", isAdmin.toString()); // Lưu trữ giá trị boolean dưới dạng chuỗi
        setFormState("loginSuccess"); // Đăng nhập thành công
        setTimeout(() => {
          navigate(isAdmin ? `/?admin=true` : "/"); // Điều hướng dựa trên giá trị isAdmin
        }, 100);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setFormState("errorFetch"); // Lỗi
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };
  {
    /*Sign up fetch */
  }
  const handleSignup = async (e) => {
    e.preventDefault();
    setFormState("loading"); // Đang tải
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
          email: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setFormState("errorFetch"); // Lỗi
        alert(errorData.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
        return;
      }

      const data = await response.json();
      console.log(data);
      if (data.verified) {
        setFormState("signupSuccess"); // Đăng ký thành công
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        setFormState("errorAccountExist"); // Lỗi Tài khoản đã tồn tại
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setFormState("error"); // Lỗi
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (action === "Sign Up") {
      handleSignup(e);
    } else {
      handleLogin(e);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center max-w-screen overflow-x-clip Login min-h-screen">
      <form className="bg-white text-black flex flex-col gap-8 px-8 py-10 roboto w-full max-w-xl">
        <div className="flex justify-center text-justify text-blue-900 text-4xl font-medium">
          {action}
        </div>
        {/*Khung alert*/}
        {formState === "errorPassword" ? (
          <div className="bg-red-200 text-red-700 roboto p-4 flex justify-center rounded-md">
            <p>Sai mật khẩu, vui lòng nhập lại</p>
          </div>
        ) : null}

        {formState === "errorAccountNotExist" ? (
          <div className="bg-red-200 text-red-700 roboto p-4 flex justify-center rounded-md">
            <p>Tài khoản không tồn tại, vui lòng đăng kí</p>
          </div>
        ) : null}

        {formState === "errorAccountExist" ? (
          <div className="bg-red-200 text-red-700 roboto p-4 flex justify-center rounded-md">
            <p>Tài khoản đã tồn tại, vui lòng đăng nhập</p>
          </div>
        ) : null}

        {/*Khung input*/}
        <div className="flex flex-col gap-4 roboto justify-center">
          {/*Khung username*/}
          <div className="bg-neutral-200 p-4 rounded-md flex justify-between gap-4 text-lg">
            <i className="bi bi-person"></i>
            <input
              name="username"
              type="text"
              placeholder="Name"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
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
                value={user.email}
                onChange={(e) => {
                  setUser({ ...user, email: e.target.value });
                  validateEmail(e.target.value);
                }}
                placeholder="Email@gmail.com"
                className="w-full"
              />
            </div>
          )}
          {emailError && <p className="text-red-500">{emailError}</p>}
          {/*Khung password*/}
          <div className="bg-neutral-200 p-4 rounded-md flex justify-between gap-4 text-lg">
            <i className="bi bi-lock"></i>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
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
