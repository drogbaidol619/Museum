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

// Hàm tính khoảng thời gian và xác định Grouping Interval
// const getGroupingInterval = (startDate, endDate) => {
//   const start = moment(startDate);
//   const end = moment(endDate);
//   const daysDiff = end.diff(start, "days");

//   if (daysDiff <= 1) {
//     return { interval: "10 minutes" }; // Cùng ngày
//   } else if (daysDiff <= 7) {
//     return { interval: "30 minutes" }; // 1 tuần
//   } else if (daysDiff <= 31) {
//     return { interval: "2 hours" }; // 1 tháng
//   } else {
//     return { interval: "1 day" }; // Lớn hơn 1 tháng
//   }
// };

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
          whereClauses.push(`(temperature >= 40 OR temperature <= 10)`);
        }
        if (humidity_alarm) {
          whereClauses.push(`(humidity >= 75 OR humidity <= 25)`);
        }
        if (light_alarm) {
          whereClauses.push(`light <= 50`);
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
          whereClauses.push(`(temperature >= 40 OR temperature <= 10)`);
        }
        if (humidity_alarm) {
          whereClauses.push(`(humidity >= 75 OR humidity <= 25)`);
        }
        if (light_alarm) {
          whereClauses.push(`light <= 50`);
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

        // Tạo CSV stringifier
        const csvStringifier = createObjectCsvStringifier({
          header: [
            { id: "temperature", title: "Temperature (°C)" },
            { id: "humidity", title: "Humidity (%)" },
            { id: "light", title: "Light (lux)" },
            { id: "motion", title: "Motion" },
            { id: "time", title: "Time" },
            { id: "date", title: "Date" },
          ],
        });

        // Chuẩn bị dữ liệu để tạo CSV với định dạng giống /api/extract
        const csvData = data.map((row) => ({
          temperature: row.temperature,
          humidity: row.humidity,
          light: row.light,
          motion: row.motion ? "Yes" : "No",
          time: row.time, // Định dạng HH24:MI:SS từ query
          date: row.date, // Định dạng YYYY-MM-DD từ query
        }));

        // Tạo nội dung CSV dưới dạng chuỗi
        const csvContent =
          csvStringifier.getHeaderString() +
          csvStringifier.stringifyRecords(csvData);

        // Tạo tên file: deviceSelect_startDate_endDate.csv
        const fileName = `${deviceSelect}_${startDate}_${endDate}.csv`;
        // Mã hóa filename để tránh ký tự không hợp lệ
        const encodedFileName = encodeURIComponent(fileName)
          .replace(/'/g, "%27")
          .replace(/"/g, "%22");

        // Thiết lập header để tải file
        res.setHeader("Content-Type", "text/csv");
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
