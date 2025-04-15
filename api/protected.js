import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.JWT_SECRET;

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

export default (req, res) => {
  authenticateJWT(req, res, () => {
    res.json({ message: "Protected route accessed.", userId: req.user.userId });
  });
};
