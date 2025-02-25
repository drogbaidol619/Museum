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

app.use(
  session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(
  cors({
    origin: "http://localhost:5173", // Thay đổi thành nguồn gốc frontend của bạn
    credentials: true, // Cho phép gửi cookie
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

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
      // Hashing the password using async/await
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const result = await db.query(
        "insert into users(email, username ,password) values ($1,$2,$3) returning *",
        [email, username, hashedPassword]
      );
      const user = result.rows[0];
      req.login(user, (err) => {
        if (err) {
          res
            .status(500)
            .json({ verified: false, message: "Internal server error" });
        }
        // Xác thực thành công,
        res.json({ verified: true, message: "Sign up success." });
      });
    }
  } catch (error) {
    console.log("Error creating user:", error);
    return res
      .status(500)
      .json({ verified: false, message: "Internal server error" });
  }
});

// Tạo session
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ verified: false, message: "Internal server error" });
    }
    // Xác thực thất bại, info chứa thông tin từ cb(null, false, ...)
    if (!user) {
      return res.status(401).json(info);
    }
    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ verified: false, message: "Internal server error" });
      }
      // Xác thực thành công, info chứa thông tin từ cb(null, user, ...)
      return res.json(info);
    });
  })(req, res, next); // gọi middleware như 1 hàm
});

passport.use(
  new Strategy(async function verify(username, password, cb) {
    console.log(username);
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
          bcrypt.compare(password, storedHashPassword, (err, result) => {
            if (err) {
              return cb(err);
            } else {
              if (result) {
                return cb(null, user, { verified: true, admin: true }); // Admin
              } else {
                return cb(null, false, {
                  verified: false,
                  message: "Incorrect Password", // Sai mật khẩu
                });
              }
            }
          });
        } else {
          bcrypt.compare(password, storedHashPassword, (err, result) => {
            if (err) {
              return cb(err);
            } else {
              if (result) {
                return cb(null, user, { verified: true, admin: false }); // Người dùng
              } else {
                return cb(null, false, {
                  verified: false,
                  message: "Incorrect Password", // Sai mật khẩu
                });
              }
            }
          });
        }
      } else {
        return cb(null, false, { verified: false, message: "User not found" });
      }
    } catch (error) {
      return cb(error);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
