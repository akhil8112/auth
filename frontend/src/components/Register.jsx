import { useState } from "react"
import api from "../api"
import "../App.css"

export default function Register() {
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [msg, setMsg] = useState("")

  //  Send OTP via Gmail
  const sendOtp = async () => {
    if (!email.trim()) {
      setMsg("⚠️ Please enter a valid email address.")
      return
    }

    try {
      await api.post("/send-otp", { email })
      setOtpSent(true)
      setMsg("OTP sent to your Gmail address! Check inbox or spam.")
    } catch (err) {
      console.error(err)
      setMsg(" Failed to send OTP. Try again later.")
    }
  }

  // ✅ Verify OTP & Register
  const handleRegister = async (e) => {
    e.preventDefault()
    if (!otp.trim()) {
      setMsg("⚠️ Please enter the OTP sent to your email.")
      return
    }

    try {
      const res = await api.post("/register", {
        fullName,
        username,
        email,
        password,
        otp
      })
      setMsg(res.data.msg || "✔️ Registered successfully!")
      setTimeout(() => (window.location.href = "/login"), 2000)
    } catch (err) {
      console.error(err)
      setMsg(err.response?.data?.msg || " Registration failed.")
    }
  }

  return (
    <div className="form-container">
      <h2>Signup</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {!otpSent ? (
          <button type="button" onClick={sendOtp}>
            Send OTP
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Verify & Register</button>
          </>
        )}
      </form>

      {msg && <p className="feedback-msg">{msg}</p>}
    </div>
  )
}
