const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Authentication token missing" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.secretKey);

    if (!decoded) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const user = await UserModel.findById({ _id: decoded.id });
    if (!user) {
      return res.status(404).send({ message: "User Not found" });
    }
    console.log("middleware", user);

    req.user = user;
    next();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


module.exports = auth