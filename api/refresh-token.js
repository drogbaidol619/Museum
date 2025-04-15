import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

let refreshTokens = [];

export default (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res
      .status(403)
      .json({ message: "Refresh Token not found, login again." });
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
    res.json({ accessToken });
  });
};
