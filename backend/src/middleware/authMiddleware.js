const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid authorization token" });
  }

  try {
    const payload = JSON.parse(
      Buffer.from(authHeader.replace("Bearer ", ""), "base64").toString("utf8"),
    );

    req.user = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid authorization token" });
  }
};

module.exports = authMiddleware;
