const jwt = require("jsonwebtoken");

module.exports = {
  jwtSecret: "zloy",
  jwtOptions: {
    expiresIn: "1h",
  },
};

function generateToken(data) {
  if (typeof data !== "object" || data === null) {
    throw new Error("Data must be a plain object");
  }
  return jwt.sign(data, module.exports.jwtSecret, module.exports.jwtOptions);
}


function verifyToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, module.exports.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }

    req.user = decoded;
    next();
  });
}

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;
