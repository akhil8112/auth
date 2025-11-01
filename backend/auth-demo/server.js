require("dotenv").config()
const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const nodemailer = require("nodemailer")
const User = require("./models/user")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:3001", credentials: true }))

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection failed:", err))

// Temporary OTP storage
const otpStore = {}

// 📧 Configure Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// ===== STEP 1: Send OTP =====
app.post("/send-otp", async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ msg: "Email is required" })

  const otp = Math.floor(100000 + Math.random() * 900000)
  otpStore[email] = otp

  // Send OTP email
  const mailOptions = {
    from: `"Library Auth" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Library OTP Code",
    text: `Your OTP for Library Management System is ${otp}. It expires in 5 minutes.`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Email send error:", error)
      return res.status(500).json({ msg: "Failed to send OTP" })
    }
    console.log(`📧 OTP ${otp} sent to ${email}`)
    res.json({ msg: "OTP sent successfully to your email!" })
  })
})

// ===== STEP 2: Verify OTP & Register User =====
app.post("/register", async (req, res) => {
  const { fullName, username, email, password, otp } = req.body

  try {
    if (otpStore[email] !== Number(otp)) {
      return res.status(400).json({ msg: "Invalid or expired OTP" })
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) return res.status(400).json({ msg: "User already exists" })

    const hashed = await bcrypt.hash(password, 10)
    const user = new User({ fullName, username, email, password: hashed })
    await user.save()

    delete otpStore[email] // Clear OTP after success
    res.json({ msg: "✅ Registration successful!" })
  } catch (err) {
    console.error("❌ Registration error:", err)
    res.status(500).json({ msg: "Server error during registration" })
  }
})

// ===== LOGIN =====
app.post("/login", async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (!user) return res.status(400).json({ msg: "User not found" })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(400).json({ msg: "Invalid password" })

  const accessToken = jwt.sign(
    { username: user.username, fullName: user.fullName, email: user.email },
    process.env.ACCESS_SECRET,
    { expiresIn: "1h" }
  )

  res.json({
    accessToken,
    fullName: user.fullName,
    username: user.username,
    msg: "✅ Login successful"
  })
})

// ===== PROFILE =====
app.get("/profile", async (req, res) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(" ")[1]
  if (!token) return res.status(401).json({ msg: "No token" })

  jwt.verify(token, process.env.ACCESS_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid token" })

    const user = await User.findOne({ username: decoded.username })
    if (!user) return res.status(404).json({ msg: "User not found" })

    res.json({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      msg: "✅ Token verified"
    })
  })
})

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
)
