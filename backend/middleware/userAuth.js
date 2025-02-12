import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  try {
    // Retrieve the token from headers (assuming it's passed in Authorization header)
    const { token } = req.headers;

    //console.log("User Token:", token);

    // Check if token exists
    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Please log in again." });
    }

    // Verify the token using JWT
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is valid and contains user ID
    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ success: false, message: "Invalid Token. Not Authorized." });
    }

    //console.log("Decoded Token:", decodedToken);

    // Attach user ID to the request object for further use
    req.userId = decodedToken.id;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error in user authentication:", error);
    res.status(401).json({ success: false, message: "Not Authorized. Invalid Token." });
  }
};

export default userAuth;
