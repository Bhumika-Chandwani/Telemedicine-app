import jwt from "jsonwebtoken";
import Signup from "../models/Signup.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret"; // ✅ store once

const adminAuth = async (req, res, next) => {
  try {
    let token;

    // ✅ 1st — read from HttpOnly cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log("🍪 Token from cookie");
    }
    // ✅ 2nd — read from Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔑 Token from header");
    }

    if (!token) {
      console.log("❌ No token found");
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Debug
    console.log("🔐 Secret (first 10):", JWT_SECRET.substring(0, 10));
    console.log("🎫 Token (first 20):", token.substring(0, 20));

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Decoded:", decoded);

    const user = await Signup.findById(decoded.id);
    console.log("👤 User found:", user?.name, "| Role:", user?.role);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("❌ AdminAuth error:", error.message);

    if (error.message === "jwt expired") {
      return res.status(401).json({ message: "Session expired. Login again." });
    }
    if (error.message === "invalid signature") {
      return res.status(401).json({ message: "Invalid token signature." });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

export default adminAuth;