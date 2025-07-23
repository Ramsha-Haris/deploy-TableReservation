const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// Token generator
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// GET Login
exports.getLogin = (req, res) => {
  res.status(200).json({
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false,
    errors: [],
    oldInput: { email: "" },
    user: {},
  });
};

// POST Login using JWT
// exports.postLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(422).json({ message: "Email and password are required" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(422).json({
//         success: false,
//         errors: ["User does not exist"],
//         oldInput: { email },
//         message: "User does not exist",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(422).json({
//         success: false,
//         errors: ["Invalid password"],
//         oldInput: { email },
//       });
//     }

//     const token = generateToken(user._id);

//     res
//       .cookie('token', token, 
//         { 
//           httpOnly: true, 
//           //secure: false }) secure: true in production,
//           secure: true,         // Required for HTTPS (ngrok)
//   sameSite: 'none'      // Allow cross-origin cookies
//         })
          
//       .status(200)
//       .json({
//         success: true,
//         message: "Login successful",
//         user: {
//           id: user._id,
//           email: user.email,
//           firstName: user.firstname,
//           lastName: user.lastname,
//           userType: user.userType,
//         },
//       });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(422).json({
        success: false,
        errors: ["User does not exist"],
        oldInput: { email },
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(422).json({
        success: false,
        errors: ["Invalid password"],
        oldInput: { email },
      });
    }

    const token = generateToken(user._id);

    res
      .set('Access-Control-Allow-Credentials', 'true') // ✅ REQUIRED for cross-origin cookie
      .cookie('token', token, {
        httpOnly: true,
        secure: true,        // ✅ required for HTTPS (like Cloudflare Tunnel)
        sameSite: 'None',    // ✅ required for cross-origin cookies
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstname,
          lastName: user.lastname,
          userType: user.userType,
        },
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// JWT-based Logout (optional cookie clear)
exports.postLogout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// GET Signup
exports.getSignup = (req, res) => {
  res.status(200).json({
    pageTitle: "Signup",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "",
    },
    user: {},
  });
};

// POST Signup
exports.postSignup = [

  check("firstname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First Name should be at least 2 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First Name should contain only alphabets"),

  check("lastname")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Last Name should contain only alphabets"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain at least one number")
    .matches(/[!@&]/)
    .withMessage("Password should contain at least one special character")
    .trim(),

  check("confirm_password")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(["user", "host"])
    .withMessage("Invalid user type"),

  check("termsAccepted")
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((value) => {
      if (value !== "on") {
        throw new Error("Please accept the terms and conditions");
      }
      return true;
    }),

  async (req, res) => {
    const { firstname, lastname, email, password, userType } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array().map(err => err.msg),
        oldInput: { firstname, lastname, email, userType },
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        userType,
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: "Signup successful",
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        errors: [err.message],
        oldInput: { firstname, lastname, email, userType },
      });
    }
  }
];
