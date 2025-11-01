import { useState } from "react"
import api from "../api"
import "../App.css" // <-- Corrected path from ../App.css

// Updated to accept setFullName prop
export default function Login({ setToken, setFullName }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post("/login", { username, password })
      const { accessToken, fullName } = res.data
      
      // Set items in localStorage
      localStorage.setItem("token", accessToken)
      localStorage.setItem("fullName", fullName)
      
      // Update global state in App.js
      setToken(accessToken)
      setFullName(fullName) // <-- This is the fix
      
      // Navigate to library (App.js will handle this automatically, 
      // but explicit redirect is faster)
      window.location.href = "/library"

    } catch {
      setMsg("Invalid credentials")
    }
  }

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}

