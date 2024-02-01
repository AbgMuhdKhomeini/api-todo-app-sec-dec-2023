import jwt from "jsonwebtoken";

// create middleware to check if user is authenticatated

async function isAuth(req, res, next) {
  try {
    // check the header for the token
    // const token = req.headers.authorization.replace("Bearer", "");

    // optional chaining operator
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "not authenticated" });
    }

    // verify the token
    const decoded = jwt.verify(token, "superdupersecret");
    // this is how to pass data from middleware to the next function
    req.user = decoded;
    next();
  } catch (error) {
    res.json(500).json(error);
  }
}

export default isAuth;
