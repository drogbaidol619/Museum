let refreshTokens = [];

export default (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.setHeader(
    "Set-Cookie",
    `refreshToken=; HttpOnly; Secure; SameSite=lax; Max-Age=0`
  );
  res.json({ message: "Logout success." });
};
