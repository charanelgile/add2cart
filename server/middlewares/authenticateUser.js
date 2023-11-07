const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const authenticateUser = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: {
        message: "Access denied",
      },
    });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userID: payload.userID,
      userName: payload.userName,
    };

    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: {
        message: "An error has been encountered",
      },
    });
  }
};

module.exports = authenticateUser;
