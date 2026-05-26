const crypto = require("crypto");
const users = new Map();

const DEFAULT_SALT = "kanban-board-default-salt";

const hashPassword = (password) => {
  return crypto
    .pbkdf2Sync(password, DEFAULT_SALT, 100000, 64, "sha512")
    .toString("hex");
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const createToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return Buffer.from(JSON.stringify(payload)).toString("base64");
};

const registerUser = (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }

    const normalizedEmail = normalizeEmail(email);
    if (users.has(normalizedEmail)) {
      return res.status(409).json({ error: "User already exists" });
    }

    const user = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      role: "user",
    };

    users.set(normalizedEmail, user);

    res.status(201).json({
      success: true,
      token: createToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to register user", details: error.message });
  }
};

const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = users.get(normalizedEmail);

    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      success: true,
      token: createToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to login user", details: error.message });
  }
};

const getCurrentUser = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
