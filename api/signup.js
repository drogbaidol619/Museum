import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { URL } from "url";

const saltRounds = 10;
const accessTokenSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

let refreshTokens = [];

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }
  const { username, password, email } = req.body;
  const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
  try {
    await db.connect();
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
        { expiresIn: "1d" }
      );
      refreshTokens.push(refreshToken);
      res.setHeader(
        "Set-Cookie",
        `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=lax; Max-Age=${
          1000 * 60 * 60 * 24 * 1
        }`
      );
      res.json({ verify: true, message: "Sign up success.", accessToken });
    }
  } catch (error) {
    console.log("Error creating user:", error);
    return res
      .status(500)
      .json({ verified: false, message: "Internal server error" });
  } finally {
    await db.end();
  }
};
