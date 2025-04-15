import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

let refreshTokens = [];

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }
  const { username, password } = req.body;
  const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
  try {
    await db.connect();
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const isAdminPasswordMatch = password === process.env.ADMIN_PASSWORD;
        const isAdminUsernameMatch = username === process.env.ADMIN_USERNAME;
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
          `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=lax; Max-Age=${
            1000 * 60 * 60 * 24 * 1
          }`
        );
        res.json({
          verify: true,
          message: "Login success.",
          accessToken,
          isAdmin: isAdmin,
        });
      } else {
        res.status(401).json({
          verify: false,
          message: "Incorrect password.",
          isAdmin: false,
        });
      }
    } else {
      res.status(401).json({ verify: false, message: "User not found." });
    }
  } catch (error) {
    console.log("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await db.end();
  }
};
