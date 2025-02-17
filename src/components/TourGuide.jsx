import { useState, useEffect, React } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";
import main from "../assets/main-facility.png";

function TourGuide() {
  return (
    <div className="flex flex-col min-w-screen min-h-screen text-white roboto ">
      {/*Cột điều hướng*/}
      <div className="bg-neutral-700 flex flex-col gap-10 pl-12 pr-14 py-10">
        {/*Cột điều hướng 1*/}
        <button className="py-6 px-4 bg-neutral-900 text-2xl font-bold">
          <i className="bi bi-caret-down"></i> Hướng dẫn đường đến và thông tin
          giờ
        </button>
        <div className="grid grid-cols-3 text-xl gap-10">
          <button className="p-4 border-b-1">
            <i className="bi bi-caret-down"></i> Cách đến
          </button>
          <button className="p-4 border-b-1">
            <i className="bi bi-caret-down"></i> Giờ mở/đóng cửa
          </button>
          <button className="p-4 border-b-1">
            <i className="bi bi-caret-down"></i> Thông tin liên hệ
          </button>
        </div>
        {/*Cột điều hướng 2*/}
        <button className="py-6 px-4 bg-neutral-900 text-2xl font-bold">
          <i className="bi bi-caret-down"></i> Bản đồ viện Bảo Tàng
        </button>
        <div className="grid grid-cols-4 text-xl gap-10">
          <button className="p-4 border-b-1">
            <i className="bi bi-caret-down"></i> Khu Nhà Chính
          </button>
          <button className="p-4 border-b-1">
            <i className="bi bi-caret-down"></i> Nhà Trưng Bày Di Sản Thế Giới
          </button>
          <button className="p-4 border-b-1">
            <i className="bi bi-caret-down"></i> Không Gian Văn Hóa Phật Giáo
          </button>
          <button className="p-4 border-b-1">
            <i className="bi bi-caret-down"></i> Kho Lưu Trữ Bảo Vật Quốc Gia
          </button>
        </div>
        {/*Cột điều hướng 3*/}
        <button className="py-6 px-4 bg-neutral-900 text-2xl font-bold">
          <i className="bi bi-caret-down"></i> Thông tin khác
        </button>
        <div className="grid grid-cols-2 text-xl gap-10">
          <button className="p-4 border-b-1">
            <i className="bi bi-caret-down"></i> Nhà hàng và Cafe
          </button>
          <button className="p-4 border-b-1">
            <i className="bi bi-caret-down"></i> Cửa hàng lưu niệm
          </button>
        </div>
      </div>
      {/*Khung thông tin*/}
      <div className="pl-12 pr-14 py-10 min-w-screen max-h-fit flex flex-col text-black">
        <h1 className="text-4xl font-bold roboto py-6">
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
    </div>
  );
}

export default TourGuide;
