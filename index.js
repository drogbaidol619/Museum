import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import env from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(
  cors({
    origin: "http://localhost:5173", // Thay đổi thành nguồn gốc frontend của bạn
    credentials: true, // Cho phép gửi cookie
  })
);

// app.use(
//   session({
//     secret: process.env.SESSION,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24, // 1 ngày
//       httpOnly: true,
//       secure: false, // Để true nếu sử dụng HTTPS
//       sameSite: "lax",
//     },
//   })
// );

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// JWT secret key
const accessTokenSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

let refreshTokens = [];

app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.status(400).json({
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
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        refreshTokenSecret,
        { expiresIn: "7d" }
      );
      refreshTokens.push(refreshToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      res.json({ verify: true, message: "Sign up success.", accessToken }); // message gửi cho người dùng
    }
  } catch (error) {
    console.log("Error creating user:", error);
    return res
      .status(500)
      .json({ verified: false, message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password); // kiểm tra password nhập vào và trong database

      if (match) {
        const isAdminPasswordMatch = password === process.env.ADMIN_PASSWORD;
        const isAdminUsernameMatch = username === process.env.ADMIN_USERNAME;

        const isAdmin = isAdminPasswordMatch && isAdminUsernameMatch; // kiểm tra Admin

        const accessToken = jwt.sign(
          { userId: user.id, email: user.email },
          accessTokenSecret,
          { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
          { userId: user.id, email: user.email },
          refreshTokenSecret,
          { expiresIn: "7d" }
        );
        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false, // Để true nếu sử dụng HTTPS
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 ngày
        });
        res.json({
          verify: true,
          message: "Login success.",
          accessToken,
          isAdmin: isAdmin,
        }); // message trả về frontend
      } else {
        res.status(401).json({
          verify: false,
          message: "Incorrect password.",
          isAdmin: isAdmin,
        }); // message trả về frontend
      }
    } else {
      res.status(401).json({ verify: false, message: "User not found." });
    }
  } catch (error) {
    console.log("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// kiểm tra access token
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token." });
    }
    req.user = decoded;
    next();
  });
};
//Kiểm tra xem refresh token còn thời hạn hay không
app.post("/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res
      .status(403)
      .json({ message: "Refresh Token not found, login again." }); // hết hàn refresh token, yêu cầu người dùng đăng nhập
  }
  jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }
    const accessToken = jwt.sign(
      { userId: user.userId, email: user.email },
      accessTokenSecret,
      { expiresIn: "15m" }
    );
    res.json({ accessToken }); // tạo access token mới
  });
});

app.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: "Protected route accessed.", userId: req.user.userId });
});

app.post("/logout", (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    // Xử lý trường hợp refreshToken không tồn tại (ví dụ: trả về lỗi, thực hiện hành động khác)
    return res.status(401).json({ message: "Refresh token not found" });
  }
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.clearCookie("refreshToken");
  res.json({ message: "Logout success." });
});

app.post("/esp8266_1_update", async (req, res) => {
  try {
    const { temperature, humidity, light, ssid, time, date, name } = req.body;
    // Thực hiện truy vấn INSERT
    await db.query(
      "INSERT INTO esp8266_1 (temperature, humidity, light, ssid, time, date ,name) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [temperature, humidity, light, ssid, time, date, name]
    );

    res.json({ message: "Data saved to database" });
  } catch (error) {
    console.error("Error saving data to database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/extract", async (req, res) => {
  const { deviceSelect, startDate, endDate } = req.body;

  try {
    const tableName = deviceSelect; // Giả sử tên bảng trùng với deviceSelect
    let query = `SELECT * FROM "${tableName}"`;
    const queryParams = [];

    if (startDate && endDate) {
      query += ` WHERE date >= $1 AND date <= $2`;
      queryParams.push(startDate, endDate);
    } else if (startDate) {
      query += ` WHERE date >= $1`;
      queryParams.push(startDate);
    } else if (endDate) {
      query += ` WHERE date <= $1`;
      queryParams.push(endDate);
    }

    const result = await db.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi trích xuất dữ liệu." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
