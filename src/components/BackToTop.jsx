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
            className="fixed bottom-15 right-15 size-16 backdrop-brightness-50 p-1 border-1 "
            style={{ cursor: "pointer" }}
            onClick={(event) => {
              props.onCheck(event);
            }}
          >
            <div className="flex flex-col text-white">
              <i className="bi bi-chevron-double-up"></i>
              <p className="roboto text-xs font-normal">PAGE TOP</p>
            </div>
          </button>
        </div>
      )}
    </>
  );
}
export default BackToTop;
