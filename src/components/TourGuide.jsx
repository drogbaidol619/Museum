import { useState, useEffect, React } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";
import main from "../assets/main-facility.png";
import cafe from "../assets/cafe.jpg";
import Menu from "../assets/Ocean-menu.pdf";
import tiramisu from "../assets/tiramisu.png";
import flan from "../assets/flan.jpg";
import luuniem1 from "../assets/luuniem-1.jpg";
import luuniem2 from "../assets/luuniem-2.jpg";

function TourGuide() {
  const [scrollYtest, setScrollYtest] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollYtest(window.scrollY);

      console.log(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const CachDen = (event) => {
    window.scrollTo({
      top: 579,
      behavior: "smooth", // Optional: For smooth scrolling
    });
  };
  const Gio = (event) => {
    window.scrollTo({
      top: 1026,
      behavior: "smooth", // Optional: For smooth scrolling
    });
  };
  const LienHe = (event) => {
    window.scrollTo({
      top: 1159,
      behavior: "smooth", // Optional: For smooth scrolling
    });
  };
  const BanDo = (event) => {
    window.scrollTo({
      top: 1500,
      behavior: "smooth", // Optional: For smooth scrolling
    });
  };
  const Cafe = (event) => {
    window.scrollTo({
      top: 2700,
      behavior: "smooth", // Optional: For smooth scrolling
    });
  };
  const LuuNiem = (event) => {
    window.scrollTo({
      top: 3780,
      behavior: "smooth", // Optional: For smooth scrolling
    });
  };

  const [button1, setButton1] = useState(false);
  const [button2, setButton2] = useState(false);
  const [button3, setButton3] = useState(false);

  return (
    <div className="flex flex-col min-w-screen min-h-screen text-white">
      {/*Cột điều hướng*/}
      <div className="bg-neutral-700 flex flex-col gap-10 pl-12 pr-14 py-10 roboto">
        {/*Cột điều hướng 1*/}
        <button
          onClick={() => setButton1((prevButton1) => !prevButton1)}
          className="py-6 px-4 bg-neutral-900 text-2xl font-bold"
        >
          <i className="bi bi-caret-down"></i> Hướng dẫn đường đến và thông tin
          giờ
        </button>
        {button1 ? (
          <div className="grid grid-cols-3 text-xl gap-10">
            <button onClick={CachDen} className="p-4 border-b-1">
              <i className="bi bi-caret-down"></i> Cách đến
            </button>
            <button onClick={Gio} className="p-4 border-b-1">
              <i className="bi bi-caret-down"></i> Giờ mở/đóng cửa
            </button>
            <button onClick={LienHe} className="p-4 border-b-1">
              <i className="bi bi-caret-down"></i> Thông tin liên hệ
            </button>
          </div>
        ) : null}

        {/*Cột điều hướng 2*/}
        <button
          onClick={() => setButton2((prevButton2) => !prevButton2)}
          className="py-6 px-4 bg-neutral-900 text-2xl font-bold"
        >
          <i className="bi bi-caret-down"></i> Bản đồ viện Bảo Tàng
        </button>
        {button2 ? (
          <button onClick={BanDo} className="p-4 border-b-1 text-xl">
            <i className="bi bi-caret-down"></i> Hướng dẫn sơ đồ tham quan
          </button>
        ) : null}
        {/*Cột điều hướng 3*/}
        <button
          onClick={() => setButton3((prevButton3) => !prevButton3)}
          className="py-6 px-4 bg-neutral-900 text-2xl font-bold"
        >
          <i className="bi bi-caret-down"></i> Thông tin khác
        </button>
        {button3 ? (
          <div className="grid grid-cols-2 text-xl gap-10">
            <button onClick={Cafe} className="p-4 border-b-1">
              <i className="bi bi-caret-down"></i> Nhà hàng và Cafe
            </button>
            <button onClick={LuuNiem} className="p-4 border-b-1">
              <i className="bi bi-caret-down"></i> Cửa hàng lưu niệm
            </button>
          </div>
        ) : null}
      </div>
      {/*Khung thông tin*/}
      <div className="pl-12 pr-14 py-10 min-w-screen max-h-fit flex flex-col text-black roboto">
        <h1 className="text-4xl font-bold py-6">
          Hướng dẫn đường đến và thông tin giờ
        </h1>
        <div className="grid grid-cols-3 gap-10">
          {/*Cột trái*/}
          <div className="col-span-2 flex flex-col gap-5">
            <h1 className="text-2xl font-normal roboto border-b-1 pb-2">
              Bằng phương tiện công cộng
            </h1>
            <ul className="list-disc list-inside">
              <li>
                Các tuyến xe buýt: 1, 14, 28, 65 (thời gian tùy thuộc vào tuyến
                xe)
              </li>
              <li>Metro (Tuyến Metro Số 1 - Bến Thành - Suối Tiên)</li>
              <li>Đi bột từ Nhà thờ Đức Bà: 15-20 phút</li>
              <li>Đi bộ từ Chợ Bến Thành: 20-25 phút</li>
              <li>Đi bộ từ Công viên 23/9: 25-30 phút</li>
            </ul>
            <h1 className="text-2xl font-normal roboto border-b-1 pb-2">
              Bằng phương tiện cá nhân
            </h1>
            <ul className="list-disc list-inside">
              <li>
                Bãi giữ xe của Bảo tàng: ngay trong khuôn viên bảo tàng (28 Võ
                Văn Tần)
              </li>
              <li>
                Bãi xe Cung Văn hóa Lao động: Cách bảo tàng: 300m (đi bộ 3-4
                phút)
              </li>
              <li>
                Bãi xe Nhà Văn hóa Thanh niên: Cách bảo tàng: 400m (đi bộ 5
                phút)
              </li>
              <li>
                Bãi xe 47 Phạm Ngọc Thạch: Cách bảo tàng: 500m (đi bộ 6-7 phút)
              </li>
            </ul>
            <h1 className="text-2xl font-normal roboto border-b-1 pb-2">
              Giờ mở cửa
            </h1>
            <div className="flex flex-col p-4 border-1 font-bold gap-2">
              <p>9:30 a.m.-17:00 p.m.</p>
              <p>9:30 a.m.-18:00 p.m. vào thứ tư và thứ bảy mỗi tuần</p>
            </div>
            <ul className="list-disc list-inside">
              <li>Ngừng nhận khách tham quan trước giờ đóng cửa 30 phút</li>
              <li>
                Giờ mở cửa vào các ngày có sự kiện đặc biệt có thể thay đổi
              </li>
            </ul>
            <h1 className="text-2xl font-normal roboto border-b-1 pb-2">
              Thông tin liên hệ
            </h1>
            <ol className="list-decimal list-inside">
              <li>
                Về thông tin du khách, triển lãm và sự kiện
                <ul className="list-disc list-inside ">
                  <li>sđt. (08) 32567890</li>
                </ul>
              </li>
              <li>
                Về thông tin khác
                <ul className="list-disc list-inside ">
                  <li>sđt. (07) 78342156</li>
                </ul>
              </li>
            </ol>
          </div>
          {/*Cột phải*/}
        </div>
        <h1 className="text-4xl font-bold roboto py-6">
          Hướng dẫn sơ đồ tham quan
        </h1>
        {/*Khu nhà chính*/}
        <div className="flex flex-col gap-4">
          <img
            className="object-center object-contain max-h-screen"
            src={main}
            alt="none"
          />
          <div className="text-2xl font-normal roboto border-b-1 pb-2">
            Ghi chú
          </div>
          <div className="grid grid-rows-7 gap-6 roboto text-xl">
            {/*Hàng 1 */}
            <div className="grid grid-cols-2">
              <div className="pl-2 border-l-4 border-blue-700">
                1. Những sự thật
              </div>
              <div className="pl-2 border-l-4 border-blue-700">2. Hồi niệm</div>
            </div>
            {/*Hàng 2 */}
            <div className="grid grid-cols-2">
              <div className="pl-2 border-l-4 border-blue-700">
                3. Việt Nam chiến tranh và hòa bình
              </div>
              <div className="pl-2 border-l-4 border-blue-700">
                4. Chất độc da cam trong chiến tranh
              </div>
            </div>
            {/*Hàng 3 */}
            <div className="grid grid-cols-2">
              <div className="pl-2 border-l-4 border-blue-700">
                5. Biểu tượng hòa bình
              </div>
              <div className="pl-2 border-l-4 border-blue-700">
                6. Tội ác chiến tranh
              </div>
            </div>
            {/*Hàng 4 */}
            <div className="grid grid-cols-2">
              <div className="pl-2 border-l-4 border-blue-700">
                7. Hậu quả chất độc da cam
              </div>
              <div className="pl-2 border-l-4 border-blue-700">
                8. Di tích chiến tranh
              </div>
            </div>
            {/*Hàng 5 */}
            <div className="grid grid-cols-2">
              <div className="pl-2 border-l-4 border-blue-700">
                9. Hậu quả chất độc da cam
              </div>
              <div className="pl-2 border-l-4 border-blue-700">
                10. Di tích chiến tranh
              </div>
            </div>
            {/*Hàng 6 */}
            <div className="grid grid-cols-2">
              <div className="pl-2 border-l-4 border-blue-700">
                11. Triễn lãm ngắn ngày{" "}
              </div>
              <div className="pl-2 border-l-4 border-blue-700">
                12. Chế độ lao tù{" "}
              </div>
            </div>
            {/*Hàng 7 */}
            <div className="grid grid-cols-2">
              <div className="pl-2 border-l-4 border-blue-700">
                13. Trưng bày ngoài trời{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Khung thông tin ngoài - cafe*/}
      <div className="pl-12 pr-14 py-10 min-w-screen max-h-fit flex flex-col text-white roboto bg-neutral-800">
        <h1 className="text-4xl font-bold roboto py-6">Thông tin khác</h1>
        <div className="grid grid-cols-2 gap-8">
          {/*Cột trái*/}
          <div className="w-fit">
            <h1 className="text-2xl roboto border-b-1 pb-2">
              Nhà hàng & Café Ocean
            </h1>
            <div className="flex flex-col pt-4 text-base gap-8">
              <ul className="list-disc list-inside ">
                <li className="pb-2">
                  Giờ mở cửa: 10:30am–5:00pm (ngưng nhận trước 4:20pm)
                </li>
                <p className="pb-2">
                  Mở cửa từ 10:30am đến 8:00pm vào Thứ Sáu và Thứ Bảy. (gọi món
                  lần cuối lúc 7h20 tối)
                </p>
                <li className="pb-2">SĐT：(03)45781234</li>
                <li className="pb-2">Menu có thể thay đổi theo tùy mùa</li>
              </ul>
              <a
                className="p-4 border-1 text-center text-xl flex justify-between w-[60%]"
                href={Menu}
                download="Ocean-menu.pdf"
              >
                Ocean Cafe Menu <i className="bi bi-caret-right"></i>
              </a>
            </div>
          </div>
          {/*Cột phải*/}
          <div className="relative h-[32rem]">
            <img
              className="object-center object-contain absolute -top-64"
              src={cafe}
              alt="none"
            />
          </div>
        </div>
      </div>
      {/*Khung thông tin ngoài - lưu niệm*/}
      <div className="pl-12 pr-14 py-10 min-w-screen max-h-fit flex flex-col text-black roboto">
        <div className="flex gap-10 transform -translate-y-50">
          {/*Vật 1*/}
          <div className="flex flex-col gap-4 w-[50%]">
            <img src={tiramisu} alt="none" />
            <p className="text-2xl">Tiramisu</p>
            <p className="text-base">35.000 đ</p>
          </div>
          {/*Vật 2*/}
          <div className="flex flex-col gap-4 w-[50%]">
            <img src={flan} alt="none" />
            <p className="text-2xl">Bánh flan</p>
            <p className="text-base">24.000 đ</p>
          </div>
        </div>
        <h1 className="text-2xl roboto border-b-1 pb-2 transform -translate-y-30">
          Cửa hàng lưu niệm
        </h1>
        <div className="flex gap-4 -translate-y-24">
          <div className="w-[50%]">
            <img src={luuniem1} alt="none" />
          </div>
          <div className="w-[50%]">
            <img src={luuniem2} alt="none" />
          </div>
        </div>
        <div className="-translate-y-18">
          <p>Nơi tốt nhất để mua sắm quà lưu niệm!</p>
          <p className=" text-justify">
            Tọa lạc tại sảnh Tòa nhà chính ,Cửa hàng lưu niệm của Bảo tàng cung
            cấp nhiều mặt hàng được làm dựa trên các hiện vật và họa tiết truyền
            thống trong bộ sưu tập của bảo tàng. Các món quà lưu niệm được bán ở
            đây bao gồm áo thun in họa tiết trống đồng, túi vải thổ cẩm, nón lá
            mini, các sản phẩm văn phòng phẩm, dấu trang, tranh dân gian Đông
            Hồ, bưu thiếp, quạt giấy truyền thống và các mặt hàng đặc trưng
            khác. Các sản phẩm thủ công mỹ nghệ truyền thống Việt Nam của các
            nghệ nhân đương đại như gốm sứ Bát Tràng, đồ mây tre đan, và các sản
            phẩm sơn mài cũng được bày bán ở đây. Ngoài ra, cửa hàng còn có một
            số ấn phẩm song ngữ Việt-Anh về nghệ thuật và văn hóa Việt Nam.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TourGuide;
