import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
import { Op } from 'sequelize';

dotenv.config();

const signup = async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;
  try {
    await User.create({ username, email, phoneNumber, password });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "User registration failed" });
  }
};

const login = async (req, res) => {
  const { emailOrPhone, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
      },
    });

    if (!user) return res.status(401).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, id: user.id, username: user.username });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Login failed" });
  }
};

export { signup, login };
