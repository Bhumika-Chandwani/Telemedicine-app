import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const protect = (req, res, next) => {
  let token;

  // 1st — HttpOnly cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log("🍪 Token from cookie");
  }
  // 2nd — Authorization header
  else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("🔑 Token from header");
  }

  if (!token) {
    console.log("❌ No token in request");
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  // ✅ Debug — show what secret is being used
  console.log("🔐 JWT_SECRET first 10 chars:", JWT_SECRET.substring(0, 10));
  console.log("🎫 Token first 20 chars:", token.substring(0, 20));

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log("✅ Token valid:", decoded);
    next();
  } catch (error) {
    console.log("❌ Token verify failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};