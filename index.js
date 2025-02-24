import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import env from "dotenv";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const loginPassword = req.body.password;
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashPassword = user.password;
      const storedEmail = user.email;

      // Kiểm tra username và mật khẩu
      if (
        username === process.env.ADMIN_USERNAME &&
        storedEmail === process.env.ADMIN_EMAIL
      ) {
        bcrypt.compare(loginPassword, storedHashPassword, (err, result) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            res
              .status(500)
              .json({ verified: false, message: "Internal server error" });
          } else {
            if (result) {
              res.json({ verified: true, admin: true }); // Mật khẩu đúng, admin
            } else {
              res.json({ verified: false, message: "Incorrect Password" });
            }
          }
        });
      } else {
        bcrypt.compare(loginPassword, storedHashPassword, (err, result) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            res
              .status(500)
              .json({ verified: false, message: "Internal server error" });
          } else {
            if (result) {
              res.json({ verified: true, admin: false }); // Mật khẩu đúng, không phải admin
            } else {
              res.json({ verified: false, message: "Incorrect Password" });
            }
          }
        });
      }
    } else {
      res.json({ verified: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ verified: false, message: "Internal server error" });
  }
});

app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.json({
        verified: false,
        message: "Email already exists. Try logging in.",
      });
    } else {
      // Hashing the password using async/await
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log(hashedPassword);
      const result = await db.query(
        "insert into users(email, username,password) values ($1,$2,$3)",
        [email, username, hashedPassword]
      );
      res.json({ verified: true, message: "Sign up success." });
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
