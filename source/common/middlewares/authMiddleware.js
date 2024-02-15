import jwt from "jsonwebtoken";

const authMiddleware = (request, response, next) => {
  try {
    let token;

    if (
      request.header("Authorization") &&
      request.header("Authorization").split(" ")[0] === "Bearer"
    ) {
      token = request.header("Authorization").split(" ")[1];

      if (token && token !== "undefined" && token !== "false") {
        try {
          const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

          request.user = { ...user, token };
        } catch (e) {
          response.status(401);
        }
      }
    } else {
      response.status(401);
    }

    next();
  } catch (error) {
    console.log(error, "error");
    next(error);
  }
};

export default authMiddleware;
