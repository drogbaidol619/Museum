import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "tranhoangminh123",
  port: 5433,
});
db.connect();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// API endpoint cho /login
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      if (password === storedPassword) {
        res.json({ verified: true });
      } else {
        res.json({ verified: false, message: "Incorrect Password" });
      }
    } else {
      res.json({ verified: false, message: "User not found" });
    }
  } catch {}
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
      const result = await db.query(
        "insert into users(email, username,password) values ($1,$2,$3)",
        [email, username, password]
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
