import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import "../App.css";

function BackToTop(props) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 134) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility); // kiểm tra vị trí
    return () => window.removeEventListener("scroll", toggleVisibility); // xóa sự kiện khi vượt quá vị trí
  }, []);

  return (
    <>
      {" "}
      {isVisible && (
        <div className="max-h-0">
          <button
            style={{ cursor: "pointer" }}
            onClick={(event) => {
              props.onCheck(event);
            }}
          >
            <i
              style={{ backgroundColor: "#00c9ac" }}
              className="bi bi-arrow-up text-xl rounded-4xl text-white fixed bottom-9 right-5 object-cover size-10 text-center pt-1"
            ></i>
          </button>
        </div>
      )}
    </>
  );
}
export default BackToTop;
