import UserModel from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//create an user

export const createUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists!" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match!" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      "MySecretKey",
      { expiresIn: "1hr" }
    );

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//user login

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist." });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res
        .status(400)
        .json({ message: "User credentials do not match." });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "MySecretKey",
      { expiresIn: "1hr" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
