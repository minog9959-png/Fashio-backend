import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Form from "../models/Form.js";
import connectDB from "../config/db.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// const navigate = useNavigate();
export const createForm = async (req, res) => {
  console.log("Signup route hit");
  try {
    await connectDB();
    const { name, email, password, newpass } = req.body;
    //validation
    if (!name || !email || !password || !newpass) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (password !== newpass) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const existingUser = await Form.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const newForm = await Form.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    });

    console.log("User Saved:", newForm);
    
    // const verifyLink = `http://localhost:8000/api/form/verify/${verificationToken}`;
    const verifyLink = `${process.env.VITE_API_URL}/api/form/verify/${verificationToken}`;
    console.log("Sending email to:", email);
    console.log("Verify Link:", verifyLink);
    await sendEmail(
      email,
      "Verify Your Email",
      `
    <h2>Welcome to Fashio</h2>
    <p>Click the button below to verify your email.</p>

    <a href="${verifyLink}"
       style="
       background:#000;
       color:#fff;
       padding:12px 25px;
       text-decoration:none;
       border-radius:5px;">
       Verify Email
    </a>
  `
    );
    console.log("Email function completed");

    res.status(201).json({
      success: true,
      message: "Signup successful. Please check your email to verify your account.",
      data: newForm,
    });

  } catch (error) {
    console.error("Signup Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// login form

export const loginForm = async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await Form.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// For Verify Email Controller
export const verifyEmail = async (req, res) => {
  try {
    await connectDB();

    const { token } = req.params;
    // console.log("Token from URL:", token);

    const user = await Form.findOne({
      verificationToken: token,
    });
    // console.log("User found:", user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link.",
      });
    }

    user.isVerified = true;
    user.verificationToken = "";

    await user.save();

    // res.status(200).json({
    //   success: true,
    //   message: "Email verified successfully.",
    // });
    return res.redirect(`${process.env.VITE_API_URL}/login`);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// verification of user - (home)
export const verifyUser = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authorized",
    user: req.user,
  });
};