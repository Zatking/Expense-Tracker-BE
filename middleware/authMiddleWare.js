const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Lấy token từ header
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // Giải mã token để lấy userID
        const decoded = jwt.verify(token, "SECRET_KEY");
        req.userID = decoded.userID; // Gắn userID vào req để dùng trong các API tiếp theo
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
