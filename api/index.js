import pg from "pg";
const { Client } = pg;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import CryptoJS from "crypto-js";

const saltRounds = 10;
const accessTokenSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
const refreshTokens = [];

// Hàm kiểm tra access token
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
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

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

    // Middleware đơn giản để parse body
    let reqBody = {};
    if (req.method !== "GET") {
      try {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const bodyString = Buffer.concat(chunks).toString();
        if (req.headers["content-type"]?.includes("application/json")) {
          reqBody = JSON.parse(bodyString);
        } else if (
          req.headers["content-type"]?.includes(
            "application/x-www-form-urlencoded"
          )
        ) {
          reqBody = bodyString.split("&").reduce((acc, pair) => {
            const [key, value] = pair.split("=");
            acc[decodeURIComponent(key)] = decodeURIComponent(value);
            return acc;
          }, {});
        }
      } catch (error) {
        return res.status(400).json({ message: "Invalid request body" });
      }
    }
    req.body = reqBody;

    // Middleware đơn giản để parse cookies
    req.cookies = cookie.parse(req.headers.cookie || "");

    const { url, method } = req;

    if (url === "/api/signup" && method === "POST") {
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
          const decryptedPasswordBytes = CryptoJS.AES.decrypt(
            password,
            SIGNUP_ENCRYPTION_KEY
          );
          const decryptedPassword = decryptedPasswordBytes.toString(
            CryptoJS.enc.Utf8
          );
          const hashedPassword = await bcrypt.hash(
            decryptedPassword,
            saltRounds
          );
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
      const { username, password } = req.body;
      try {
        const result = await db.query(
          "SELECT * FROM users WHERE username = $1",
          [username]
        );
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const decryptedPasswordBytes = CryptoJS.AES.decrypt(
            password,
            process.env.LOGIN_ENCRYPTION_KEY
          );
          const decryptedPassword = decryptedPasswordBytes.toString(
            CryptoJS.enc.Utf8
          );
          const match = await bcrypt.compare(decryptedPassword, user.password);
          if (match) {
            const isAdminPasswordMatch =
              decryptedPassword === process.env.ADMIN_PASSWORD;
            const isAdminUsernameMatch =
              username === process.env.ADMIN_USERNAME;
            const isAdmin = isAdminPasswordMatch && isAdminUsernameMatch;
            const accessToken = jwt.sign(
              { userId: user.id, email: user.email },
              accessTokenSecret,
              { expiresIn: "15m" }
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
          { expiresIn: "15m" }
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
    } else if (url === "/api/esp8266_1_update" && method === "POST") {
      const { temperature, humidity, light, ssid, time, date, name } = req.body;
      try {
        await db.query(
          'INSERT INTO "ESP8266_1" (temperature, humidity, light, ssid, time, date ,name) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [temperature, humidity, light, ssid, time, date, name]
        );
        return res.json({ message: "Data saved to database" });
      } catch (error) {
        console.error("Error saving data to database:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    } else if (url === "/api/extract" && method === "POST") {
      const {
        deviceSelect,
        startDate,
        endDate,
        temperature_alarm,
        humidity_alarm,
        light_alarm,
      } = req.body;
      try {
        const tableName = deviceSelect;
        let query = `SELECT * FROM "${tableName}"`;
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
          whereClauses.push(`(humidity >= 60 OR humidity <= 45)`);
        }
        if (light_alarm) {
          whereClauses.push(`light >= 100`);
        }

        if (whereClauses.length > 0) {
          query += ` WHERE ${whereClauses.join(" AND ")}`;
        }

        const result = await db.query(query, queryParams);
        return res.json(result.rows);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Lỗi trích xuất dữ liệu." });
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
