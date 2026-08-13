import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        passwordHash
    });

    res.status(201).json({ 
        message: "User created successfully",
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage
        } });
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      userId: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage
    }
  });
};