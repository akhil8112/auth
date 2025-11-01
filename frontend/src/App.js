import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register" 
import Library from "./components/welcome" 
import Cart from "./components/cart" 
import "./App.css"

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [fullName, setFullName] = useState(localStorage.getItem("fullName"))

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("readingCart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  // ✅ New: Dark Mode state
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  )

  // Persist cart + theme
  useEffect(() => {
    localStorage.setItem("readingCart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light")
  }, [darkMode])

  return (
    <Router>
      {/* ✅ Pass darkMode toggle into Cart header */}
      <Cart 
        token={token}
        fullName={fullName}
        setToken={setToken}
        cart={cart}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <Routes>
        <Route 
          path="/" 
          element={token ? <Navigate to="/library" /> : <Navigate to="/login" />} 
        />
        <Route path="/signup" element={<Register />} />
        <Route 
          path="/login" 
          element={<Login setToken={setToken} setFullName={setFullName} />} 
        />
        <Route 
          path="/library" 
          element={
            token ? (
              <Library 
                cart={cart} 
                setCart={setCart} 
                fullName={fullName} 
                setToken={setToken}
              />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route path="/welcome" element={<Navigate to="/library" />} />
      </Routes>
    </Router>
  )
}
