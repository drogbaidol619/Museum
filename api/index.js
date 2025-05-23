import pg from "pg";
const { Client } = pg;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import moment from "moment";
import { createObjectCsvStringifier } from "csv-writer";

const saltRounds = 10;
const accessTokenSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
const refreshTokens = [];

// Hàm kiểm tra  token
const authenticateJWT = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return { error: { status: 401, message: "No token provided." } };
  }
  try {
    const decoded = jwt.verify(token, accessTokenSecret);
    return { user: decoded };
  } catch (err) {
    return { error: { status: 401, message: "Failed to authenticate token." } };
  }
};

export default async (req, res) => {
  // Thiết lập CORS (tương tự như middleware cors)
  res.setHeader("Access-Control-Allow-Origin", "https://museum-mu.vercel.app"); // Thay đổi thành nguồn gốc frontend của bạn
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-api-key"
  );

  // Xử lý OPTIONS request (preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const db = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });

  try {
    await db.connect();

    const { url, method } = req;

    if (url === "/api/signup" && method === "POST") {
      //sign up
      const { username, password, email } = req.body;
      try {
        const checkResult = await db.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );
        if (checkResult.rows.length > 0) {
          return res.status(400).json({
            verified: false,
            message: "Email already exists. Try logging in.",
          });
        } else {
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          const result = await db.query(
            "INSERT INTO users(email, username, password) VALUES ($1, $2, $3) RETURNING *",
            [email, username, hashedPassword]
          );
          const user = result.rows[0];
          const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            accessTokenSecret,
            { expiresIn: "30m" }
          );
          const refreshToken = jwt.sign(
            { userId: user.id, email: user.email },
            refreshTokenSecret,
            { expiresIn: "1d" }
          );
          refreshTokens.push(refreshToken);
          res.setHeader(
            "Set-Cookie",
            cookie.serialize("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true, //true nếu sử dụng HTTPS trên production
              sameSite: "lax",
              maxAge: 1000 * 60 * 60 * 1,
            })
          );
          return res.json({
            verify: true,
            message: "Sign up success.",
            accessToken,
          });
        }
      } catch (error) {
        console.error("Error creating user:", error);
        return res
          .status(500)
          .json({ verified: false, message: "Internal server error" });
      }
    } else if (url === "/api/login" && method === "POST") {
      // login
      const { username, password } = req.body;
      try {
        const result = await db.query(
          "SELECT * FROM users WHERE username = $1",
          [username]
        );
        if (result.rows.length > 0) {
          const user = result.rows[0];

          const match = await bcrypt.compare(password, user.password);
          if (match) {
            const isAdminPasswordMatch =
              password === process.env.ADMIN_PASSWORD;
            const isAdminUsernameMatch =
              username === process.env.ADMIN_USERNAME;
            const isAdmin = isAdminPasswordMatch && isAdminUsernameMatch;
            const accessToken = jwt.sign(
              { userId: user.id, email: user.email },
              accessTokenSecret,
              { expiresIn: "30m" }
            );
            const refreshToken = jwt.sign(
              { userId: user.id, email: user.email },
              refreshTokenSecret,
              { expiresIn: "1d" }
            );
            refreshTokens.push(refreshToken);
            res.setHeader(
              "Set-Cookie",
              cookie.serialize("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true, // Nên là true nếu bạn đang sử dụng HTTPS trên production
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 1,
              })
            );
            return res.json({
              verify: true,
              message: "Login success.",
              accessToken,
              isAdmin,
            });
          } else {
            return res.status(401).json({
              verify: false,
              message: "Incorrect password.",
              isAdmin: false,
            });
          }
        } else {
          return res
            .status(401)
            .json({ verify: false, message: "User not found." });
        }
      } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    } else if (url === "/api/refresh-token" && method === "POST") {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res
          .status(403)
          .json({ message: "Refresh Token not found, login again." });
      }

      try {
        const user = jwt.verify(refreshToken, refreshTokenSecret);
        const accessToken = jwt.sign(
          { userId: user.userId, email: user.email },
          accessTokenSecret,
          { expiresIn: "30m" }
        );
        return res.json({ accessToken });
      } catch (err) {
        return res.status(403).json({ message: "Invalid Refresh Token" });
      }
    } else if (url === "/api/protected" && method === "GET") {
      const authResult = authenticateJWT(req);
      if (authResult.error) {
        return res.status(authResult.error.status).json(authResult.error);
      }
      return res.json({
        message: "Protected route accessed.",
        userId: authResult.user.userId,
      });
    } else if (url === "/api/logout" && method === "POST") {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
      }
      const index = refreshTokens.indexOf(refreshToken);
      if (index > -1) {
        refreshTokens.splice(index, 1);
      }
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("refreshToken", "", {
          httpOnly: true,
          secure: true, // Nên là true nếu bạn đang sử dụng HTTPS trên production
          sameSite: "lax",
          maxAge: 0,
        })
      );
      return res.json({ message: "Logout success." });
      // } else if (url === "/api/esp8266_1_update" && method === "POST") {
      //   const apiKey = req.headers["x-api-key"]; // Lấy API Key từ header 'x-api-key'
      //   if (!apiKey || apiKey !== process.env.ESP8266_API_KEY) {
      //     return res
      //       .status(401)
      //       .json({ error: { status: 401, message: "Invalid API Key." } });
      //   }
      //   // Lấy dữ liệu từ body
      //   const { temperature, humidity, light, motion, ssid, time, date, name } =
      //     req.body;

      //   try {
      //     // Đảm bảo số lượng giá trị khớp với số cột
      //     await db.query(
      //       'INSERT INTO "ESP8266_1" (temperature, humidity, light, motion, ssid, time, date, name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      //       [
      //         temperature || null,
      //         humidity || null,
      //         light || null,
      //         motion || false,
      //         ssid || "",
      //         time || new Date().toLocaleTimeString(),
      //         date || new Date().toISOString().split("T")[0],
      //         name || "ESP8266_1",
      //       ]
      //     );
      //     return res.json({ message: "Data saved to database" });
      //   } catch (error) {
      //     console.error("Detailed error: Database ", {
      //       message: error.message,
      //       query: error.query, // PostgreSQL sẽ trả về câu query bị lỗi
      //       stack: error.stack,
      //     });
      //     return res.status(500).json({
      //       message: "Database error",
      //       detail: error.message,
      //     });
      //   }
      // }
    } else if (url === "/api/extract" && method === "POST") {
      const {
        deviceSelect,
        startDate,
        endDate,
        temperature_alarm,
        humidity_alarm,
        light_alarm,
        motion_alarm,
      } = req.body;
      try {
        const tableName = deviceSelect;
        let query = `
      SELECT
        temperature,
        humidity,
        light,
        motion,
        ssid,
        debug,
        TO_CHAR(date, 'YYYY-MM-DD') as date,
        TO_CHAR(time, 'HH24:MI:SS') as time
      FROM "${tableName}"
    `;
        const queryParams = [];
        let whereClauses = [];

        if (startDate && endDate) {
          whereClauses.push(
            `date >= $${queryParams.push(
              startDate
            )} AND date <= $${queryParams.push(endDate)}`
          );
        } else if (startDate) {
          whereClauses.push(`date >= $${queryParams.push(startDate)}`);
        } else if (endDate) {
          whereClauses.push(`date <= $${queryParams.push(endDate)}`);
        }

        if (temperature_alarm) {
          whereClauses.push(
            `(temperature >= 40 OR temperature <= 10 OR temperature IS NULL)`
          );
        }
        if (humidity_alarm) {
          whereClauses.push(
            `(humidity >= 75 OR humidity <= 25 OR humidity IS NULL)`
          );
        }
        if (light_alarm) {
          whereClauses.push(`(light <= 50 OR light IS NULL)`);
        }
        if (motion_alarm) {
          whereClauses.push(`motion = true`);
        }

        if (whereClauses.length > 0) {
          query += ` WHERE ${whereClauses.join(" AND ")}`;
        }
        query += ` ORDER BY date, time`;

        const result = await db.query(query, queryParams);
        const data = result.rows;

        if (data.length === 0) {
          return res
            .status(404)
            .json({ error: "Không có dữ liệu để trích xuất." });
        }

        // Tính toán thống kê nhiệt độ
        const temperatures = data
          .map((item) => item.temperature)
          .filter((val) => val !== null);
        const maxTemp = Math.max(...temperatures);
        const minTemp = Math.min(...temperatures);
        const avgTemp =
          temperatures.length > 0
            ? temperatures.reduce((a, b) => a + b, 0) / temperatures.length
            : 0;
        const totalPoints = temperatures.length;

        const maxTempRecord = data.find((item) => item.temperature === maxTemp);
        const minTempRecord = data.find((item) => item.temperature === minTemp);
        const maxTempTime = maxTempRecord
          ? `${maxTempRecord.date} ${maxTempRecord.time}`
          : "N/A";
        const minTempTime = minTempRecord
          ? `${minTempRecord.date} ${minTempRecord.time}`
          : "N/A";

        const firstRecordTime =
          data.length > 0 && data[0].date && data[0].time
            ? moment(`${data[0].date} ${data[0].time}`, "YYYY-MM-DD HH:mm:ss")
            : null;
        const lastRecordTime =
          data.length > 0 &&
          data[data.length - 1].date &&
          data[data.length - 1].time
            ? moment(
                `${data[data.length - 1].date} ${data[data.length - 1].time}`,
                "YYYY-MM-DD HH:mm:ss"
              )
            : null;

        let elapsedTime = "N/A";
        if (
          firstRecordTime &&
          lastRecordTime &&
          firstRecordTime.isValid() &&
          lastRecordTime.isValid()
        ) {
          const duration = moment.duration(
            lastRecordTime.diff(firstRecordTime)
          );
          const days = Math.floor(duration.asDays());
          const hours = Math.floor(duration.asHours()) % 24;
          const minutes = Math.floor(duration.asMinutes()) % 60;
          const seconds = Math.floor(duration.asSeconds()) % 60;
          const parts = [];
          if (days > 0) parts.push(`${days} ngày`);
          if (hours > 0) parts.push(`${hours} giờ`);
          if (minutes > 0 || (days === 0 && hours === 0))
            parts.push(`${minutes} phút`);
          if (seconds > 0 || parts.length === 0) parts.push(`${seconds} giây`);
          elapsedTime = parts.join(", ");
        }

        // Tính toán khoảng thời gian xuất hiện nhiều nhất giữa các lần ghi nhận (giây)
        let groupingInterval = "N/A";
        if (data.length >= 2) {
          const timeDifferences = [];
          for (let i = 1; i < data.length; i++) {
            const currentTime = moment(
              `${data[i].date} ${data[i].time}`,
              "YYYY-MM-DD HH:mm:ss"
            );
            const previousTime = moment(
              `${data[i - 1].date} ${data[i - 1].time}`,
              "YYYY-MM-DD HH:mm:ss"
            );
            if (currentTime.isValid() && previousTime.isValid()) {
              const diff = currentTime.diff(previousTime, "seconds");
              timeDifferences.push(diff);
            }
          }

          if (timeDifferences.length > 0) {
            // Tìm giá trị xuất hiện nhiều nhất (mode)
            const frequencyMap = {};
            let maxFrequency = 0;
            let mostFrequentInterval = timeDifferences[0];

            timeDifferences.forEach((diff) => {
              frequencyMap[diff] = (frequencyMap[diff] || 0) + 1;
              if (frequencyMap[diff] > maxFrequency) {
                maxFrequency = frequencyMap[diff];
                mostFrequentInterval = diff;
              }
            });

            groupingInterval = `${mostFrequentInterval} giây`;
            console.log(
              `Khoảng thời gian xuất hiện nhiều nhất: ${groupingInterval} (xuất hiện ${maxFrequency} lần)`
            );
          } else {
            groupingInterval = "Không đủ dữ liệu để tính toán";
            console.log("Không có dữ liệu hợp lệ để tính khoảng thời gian.");
          }
        }

        // Tính toán thống kê độ ẩm
        const humidities = data
          .map((item) => item.humidity)
          .filter((val) => val !== null);
        const maxHumidity =
          humidities.length > 0 ? Math.max(...humidities) : null;
        const minHumidity =
          humidities.length > 0 ? Math.min(...humidities) : null;
        const avgHumidity =
          humidities.length > 0
            ? humidities.reduce((a, b) => a + b, 0) / humidities.length
            : null;

        // Tính toán thống kê ánh sáng
        const lights = data
          .map((item) => item.light)
          .filter((val) => val !== null);
        const maxLight = lights.length > 0 ? Math.max(...lights) : null;
        const minLight = lights.length > 0 ? Math.min(...lights) : null;
        const avgLight =
          lights.length > 0
            ? lights.reduce((a, b) => a + b, 0) / lights.length
            : null;

        // Tính toán tổng số lần chuyển động
        const motionCount = data.filter((item) => item.motion === true).length;

        return res.json({
          data,
          temperatureStats: {
            maxTemp,
            maxTempTime,
            minTemp,
            minTempTime,
            avgTemp,
            totalPoints,
            firstRecord: firstRecordTime
              ? firstRecordTime.format("YYYY-MM-DD HH:mm:ss")
              : "N/A",
            lastRecord: lastRecordTime
              ? lastRecordTime.format("YYYY-MM-DD HH:mm:ss")
              : "N/A",
            elapsedTime,
            groupingInterval,
          },
          humidityStats: {
            maxHumidity,
            minHumidity,
            avgHumidity,
          },
          lightStats: {
            maxLight,
            minLight,
            avgLight,
          },
          motionStats: {
            motionCount,
          },
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Lỗi trích xuất dữ liệu." });
      }
    } else if (url === "/api/csv" && method === "POST") {
      const {
        deviceSelect,
        startDate,
        endDate,
        temperature_alarm,
        humidity_alarm,
        light_alarm,
        motion_alarm,
      } = req.body;

      if (!deviceSelect || !startDate || !endDate) {
        return res.status(400).json({
          message: "Thiếu thông tin: deviceSelect, startDate hoặc endDate.",
        });
      }

      try {
        // Truy vấn dữ liệu từ database với định dạng giống /api/extract
        const tableName = deviceSelect;
        let query = `
      SELECT
        temperature,
        humidity,
        light,
        motion,
        ssid,
        debug,
        TO_CHAR(date, 'YYYY-MM-DD') as date,
        TO_CHAR(time, 'HH24:MI:SS') as time
      FROM "${tableName}"
    `;
        const queryParams = [];
        let whereClauses = [];

        whereClauses.push(
          `date >= $${queryParams.push(
            startDate
          )} AND date <= $${queryParams.push(endDate)}`
        );

        if (temperature_alarm) {
          whereClauses.push(
            `(temperature >= 40 OR temperature <= 10 OR temperature IS NULL)`
          );
        }
        if (humidity_alarm) {
          whereClauses.push(
            `(humidity >= 75 OR humidity <= 25 OR humidity IS NULL)`
          );
        }
        if (light_alarm) {
          whereClauses.push(`(light <= 50 OR light IS NULL)`);
        }
        if (motion_alarm) {
          whereClauses.push(`motion = true`);
        }

        if (whereClauses.length > 0) {
          query += ` WHERE ${whereClauses.join(" AND ")}`;
        }
        query += ` ORDER BY date, time`;

        const result = await db.query(query, queryParams);
        const data = result.rows;

        if (data.length === 0) {
          return res
            .status(404)
            .json({ message: "Không có dữ liệu để xuất CSV." });
        }

        // Tính toán thống kê
        const temperatures = data
          .map((item) => item.temperature)
          .filter((val) => val !== null);
        const humidities = data
          .map((item) => item.humidity)
          .filter((val) => val !== null);
        const lights = data
          .map((item) => item.light)
          .filter((val) => val !== null);
        const motionCount = data.filter((item) => item.motion === true).length;

        const avgTemp =
          temperatures.length > 0
            ? (
                temperatures.reduce((a, b) => a + b, 0) / temperatures.length
              ).toFixed(2)
            : "N/A";
        const maxTemp =
          temperatures.length > 0 ? Math.max(...temperatures) : "N/A";
        const minTemp =
          temperatures.length > 0 ? Math.min(...temperatures) : "N/A";

        const avgHumidity =
          humidities.length > 0
            ? (
                humidities.reduce((a, b) => a + b, 0) / humidities.length
              ).toFixed(2)
            : "N/A";
        const maxHumidity =
          humidities.length > 0 ? Math.max(...humidities) : "N/A";
        const minHumidity =
          humidities.length > 0 ? Math.min(...humidities) : "N/A";

        const avgLight =
          lights.length > 0
            ? (lights.reduce((a, b) => a + b, 0) / lights.length).toFixed(2)
            : "N/A";
        const maxLight = lights.length > 0 ? Math.max(...lights) : "N/A";
        const minLight = lights.length > 0 ? Math.min(...lights) : "N/A";

        // Tạo CSV stringifier với cột "Thống kê" thêm vào trước
        const csvStringifier = createObjectCsvStringifier({
          header: [
            { id: "stats", title: "Thống kê" }, // Cột mới
            { id: "temperature", title: "Nhiệt độ (°C)" },
            { id: "humidity", title: "Độ ẩm (%)" },
            { id: "light", title: "Ánh sáng (lux)" },
            { id: "motion", title: "Rung động" },
            { id: "time", title: "Thời gian" },
            { id: "date", title: "Ngày tháng" },
            { id: "debug", title: "Thông tin thêm" },
          ],
        });

        // Chuẩn bị dữ liệu thống kê dưới dạng các dòng CSV
        const statsRows = [
          {
            stats: `Tên thiết bị: ${deviceSelect}`,
            temperature: "",
            humidity: "",
            light: "",
            motion: "",
            time: "",
            date: "",
            debug: "",
          },
          {
            stats: "Giá trị trung bình",
            temperature: avgTemp,
            humidity: avgHumidity,
            light: avgLight,
            motion: motionCount,
            time: "",
            date: "",
            debug: "",
          },
          {
            stats: "Giá trị lớn nhất",
            temperature: maxTemp,
            humidity: maxHumidity,
            light: maxLight,
            motion: "",
            time: "",
            date: "",
            debug: "",
          },
          {
            stats: "Giá trị nhỏ nhất",
            temperature: minTemp,
            humidity: minHumidity,
            light: minLight,
            motion: "",
            time: "",
            date: "",
            debug: "",
          },
          {
            stats: "", // Dòng trống để phân tách
            temperature: "",
            humidity: "",
            light: "",
            motion: "",
            time: "",
            date: "",
            debug: "",
          },
        ];

        // Chuẩn bị dữ liệu chính
        const csvData = data.map((row) => ({
          stats: "", // Cột "Thống kê" để trống cho các dòng dữ liệu
          temperature: row.temperature,
          humidity: row.humidity,
          light: row.light,
          motion: row.motion ? "Yes" : "No",
          time: row.time,
          date: row.date,
          debug: row.debug,
        }));

        // Kết hợp dữ liệu thống kê và dữ liệu chính
        const combinedData = [...statsRows, ...csvData];

        // Tạo nội dung CSV
        const csvContent =
          "\uFEFF" + // Thêm BOM để đảm bảo UTF-8 hiển thị đúng tiếng Việt
          csvStringifier.getHeaderString() +
          csvStringifier.stringifyRecords(combinedData);

        // Tạo tên file: deviceSelect_startDate_endDate.csv
        const fileName = `${deviceSelect}_${startDate}_${endDate}.csv`;
        const encodedFileName = encodeURIComponent(fileName)
          .replace(/'/g, "%27")
          .replace(/"/g, "%22");

        // Thiết lập header để tải file
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename*=UTF-8''${encodedFileName}`
        );

        // Gửi nội dung CSV về client
        return res.send(csvContent);
      } catch (error) {
        console.error("Error generating CSV file:", error);
        return res.status(500).json({ message: "Lỗi khi xuất file CSV." });
      }
    } else if (url === "/api/csvAll" && method === "POST") {
      const { startDate, endDate } = req.body;

      // Kiểm tra tham số startDate và endDate
      if (!startDate || !endDate) {
        return res.status(400).json({
          message: "Thiếu thông tin: startDate hoặc endDate.",
        });
      }

      try {
        // Danh sách các bảng cần xuất dữ liệu
        const tables = [
          "Ấn_Hoàng_đế_chi_bảo",
          "Bình_Tỳ_Bà_men_ngọc",
          "Chân_Đế_Phật_Thích_Ca",
          "Gươm_Đồng_Làng_Vạc",
          "Trống_Đồng_Ngọc_Lũ",
        ];

        // Tạo header cho CSV với cột trống giữa các bảng
        const header = [];
        for (const table of tables) {
          header.push({ id: `stats_${table}`, title: `Thống kê - ${table}` }); // Giữ tên bảng ở cột Thống kê
          header.push({ id: `temperature_${table}`, title: `Nhiệt độ (°C)` }); // Không thêm tên bảng
          header.push({ id: `humidity_${table}`, title: `Độ ẩm (%)` });
          header.push({ id: `light_${table}`, title: `Ánh sáng (lux)` });
          header.push({ id: `motion_${table}`, title: `Rung động` });
          header.push({ id: `time_${table}`, title: `Thời gian` });
          header.push({ id: `date_${table}`, title: `Ngày tháng` });
          header.push({ id: `debug_${table}`, title: `Thông tin thêm` });
          if (table !== tables[tables.length - 1]) {
            header.push({ id: `empty_${table}`, title: "" }); // Cột trống giữa các bảng
          }
        }

        // Tạo CSV stringifier với header đã xây dựng
        const csvStringifier = createObjectCsvStringifier({ header });

        // Lấy dữ liệu từ tất cả các bảng
        const allTableData = {};
        for (const tableName of tables) {
          let query = `
        SELECT
          temperature,
          humidity,
          light,
          motion,
          ssid,
          debug,
          TO_CHAR(date, 'YYYY-MM-DD') as date,
          TO_CHAR(time, 'HH24:MI:SS') as time
        FROM "${tableName}"
        WHERE date >= $1 AND date <= $2
        ORDER BY date, time
      `;
          const result = await db.query(query, [startDate, endDate]);
          allTableData[tableName] = result.rows;
        }

        // Tính toán thống kê cho từng bảng
        const statsRows = [];
        const tableStats = {};

        for (const tableName of tables) {
          const data = allTableData[tableName];
          const temperatures = data
            .map((item) => item.temperature)
            .filter((val) => val !== null);
          const humidities = data
            .map((item) => item.humidity)
            .filter((val) => val !== null);
          const lights = data
            .map((item) => item.light)
            .filter((val) => val !== null);
          const motionCount = data.filter(
            (item) => item.motion === true
          ).length;

          tableStats[tableName] = {
            avgTemp:
              temperatures.length > 0
                ? (
                    temperatures.reduce((a, b) => a + b, 0) /
                    temperatures.length
                  ).toFixed(2)
                : "N/A",
            maxTemp:
              temperatures.length > 0 ? Math.max(...temperatures) : "N/A",
            minTemp:
              temperatures.length > 0 ? Math.min(...temperatures) : "N/A",
            avgHumidity:
              humidities.length > 0
                ? (
                    humidities.reduce((a, b) => a + b, 0) / humidities.length
                  ).toFixed(2)
                : "N/A",
            maxHumidity:
              humidities.length > 0 ? Math.max(...humidities) : "N/A",
            minHumidity:
              humidities.length > 0 ? Math.min(...humidities) : "N/A",
            avgLight:
              lights.length > 0
                ? (lights.reduce((a, b) => a + b, 0) / lights.length).toFixed(2)
                : "N/A",
            maxLight: lights.length > 0 ? Math.max(...lights) : "N/A",
            minLight: lights.length > 0 ? Math.min(...lights) : "N/A",
            motionCount,
          };
        }

        // Tạo các dòng thống kê
        const statRow1 = {};
        const statRow2 = {};
        const statRow3 = {};
        const statRow4 = {};
        const emptyRow = {};

        for (const table of tables) {
          const stats = tableStats[table];
          statRow1[`stats_${table}`] = `Tên thiết bị: ${table}`;
          statRow1[`temperature_${table}`] = "";
          statRow1[`humidity_${table}`] = "";
          statRow1[`light_${table}`] = "";
          statRow1[`motion_${table}`] = "";
          statRow1[`time_${table}`] = "";
          statRow1[`date_${table}`] = "";
          statRow1[`debug_${table}`] = "";
          if (table !== tables[tables.length - 1]) {
            statRow1[`empty_${table}`] = "";
          }

          statRow2[`stats_${table}`] = "Giá trị trung bình";
          statRow2[`temperature_${table}`] = stats.avgTemp;
          statRow2[`humidity_${table}`] = stats.avgHumidity;
          statRow2[`light_${table}`] = stats.avgLight;
          statRow2[`motion_${table}`] = stats.motionCount;
          statRow2[`time_${table}`] = "";
          statRow2[`date_${table}`] = "";
          statRow2[`debug_${table}`] = "";
          if (table !== tables[tables.length - 1]) {
            statRow2[`empty_${table}`] = "";
          }

          statRow3[`stats_${table}`] = "Giá trị lớn nhất";
          statRow3[`temperature_${table}`] = stats.maxTemp;
          statRow3[`humidity_${table}`] = stats.maxHumidity;
          statRow3[`light_${table}`] = stats.maxLight;
          statRow3[`motion_${table}`] = "";
          statRow3[`time_${table}`] = "";
          statRow3[`date_${table}`] = "";
          statRow3[`debug_${table}`] = "";
          if (table !== tables[tables.length - 1]) {
            statRow3[`empty_${table}`] = "";
          }

          statRow4[`stats_${table}`] = "Giá trị bé nhất";
          statRow4[`temperature_${table}`] = stats.minTemp;
          statRow4[`humidity_${table}`] = stats.minHumidity;
          statRow4[`light_${table}`] = stats.minLight;
          statRow4[`motion_${table}`] = "";
          statRow4[`time_${table}`] = "";
          statRow4[`date_${table}`] = "";
          statRow4[`debug_${table}`] = "";
          if (table !== tables[tables.length - 1]) {
            statRow4[`empty_${table}`] = "";
          }

          emptyRow[`stats_${table}`] = "";
          emptyRow[`temperature_${table}`] = "";
          emptyRow[`humidity_${table}`] = "";
          emptyRow[`light_${table}`] = "";
          emptyRow[`motion_${table}`] = "";
          emptyRow[`time_${table}`] = "";
          emptyRow[`date_${table}`] = "";
          emptyRow[`debug_${table}`] = "";
          if (table !== tables[tables.length - 1]) {
            emptyRow[`empty_${table}`] = "";
          }
        }

        statsRows.push(statRow1, statRow2, statRow3, statRow4, emptyRow);

        // Tìm số lượng hàng dữ liệu tối đa từ tất cả các bảng
        const maxRows = Math.max(
          ...tables.map((table) => allTableData[table].length)
        );

        // Tạo dữ liệu chính: không đồng bộ thời gian, điền tuần tự
        const csvData = [];
        for (let i = 0; i < maxRows; i++) {
          const row = {};

          for (const table of tables) {
            const tableData = allTableData[table];
            const matchingRow = i < tableData.length ? tableData[i] : null;

            row[`stats_${table}`] = "";
            row[`temperature_${table}`] = matchingRow
              ? matchingRow.temperature
              : "";
            row[`humidity_${table}`] = matchingRow ? matchingRow.humidity : "";
            row[`light_${table}`] = matchingRow ? matchingRow.light : "";
            row[`motion_${table}`] = matchingRow
              ? matchingRow.motion
                ? "Yes"
                : "No"
              : "";
            row[`time_${table}`] = matchingRow ? matchingRow.time : "";
            row[`date_${table}`] = matchingRow ? matchingRow.date : "";
            row[`debug_${table}`] = matchingRow ? matchingRow.debug : "";
            if (table !== tables[tables.length - 1]) {
              row[`empty_${table}`] = "";
            }
          }

          csvData.push(row);
        }

        // Kết hợp dữ liệu thống kê và dữ liệu chính
        const combinedData = [...statsRows, ...csvData];

        if (combinedData.length === statsRows.length) {
          return res
            .status(404)
            .json({
              message: "Không có dữ liệu để xuất CSV từ bất kỳ bảng nào.",
            });
        }

        // Tạo nội dung CSV
        const csvContent =
          "\uFEFF" +
          csvStringifier.getHeaderString() +
          csvStringifier.stringifyRecords(combinedData);

        // Tạo tên file: all_devices_startDate_endDate.csv
        const fileName = `all_devices_${startDate}_${endDate}.csv`;
        const encodedFileName = encodeURIComponent(fileName)
          .replace(/'/g, "%27")
          .replace(/"/g, "%22");

        // Thiết lập header để tải file
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename*=UTF-8''${encodedFileName}`
        );

        // Gửi nội dung CSV về client
        return res.send(csvContent);
      } catch (error) {
        console.error("Error generating CSV file:", error);
        return res.status(500).json({ message: "Lỗi khi xuất file CSV." });
      }
    } else {
      return res.status(404).json({ message: "Endpoint not found." });
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ message: "Database connection error." });
  } finally {
    await db.end();
  }
};
