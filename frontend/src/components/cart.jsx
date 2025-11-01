import { useState } from "react"
import { Link } from "react-router-dom"

export default function Header({ token, fullName, setToken, cart, darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("fullName")
    setToken(null)
  }

  const name = fullName || localStorage.getItem("fullName") || "User"

  return (
    <header className="main-header">
      <Link to="/" className="logo">
        Presonal Library 
      </Link>

      <nav className="main-nav">
        {token ? (
          <div className="nav-links">
            {/* Profile section */}
            <div
              className="profile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="profile-icon">👤</div>
              <span className="profile-name">{name}</span>

              {menuOpen && (
                <div className="dropdown-menu">
                  <p className="dropdown-item">{name}</p>
                  <hr />
                  <Link to="/library" className="dropdown-item">
                    🏠 My Library
                  </Link>
                  <Link to="/cart" className="dropdown-item">
                    🛒 My Cart ({cart.length})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-link"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Icon Toggle */}
            <button
              className="nav-btn theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        ) : (
          <div className="nav-links">
            <Link to="/login" className="nav-btn">
              Login
            </Link>
            <Link to="/signup" className="nav-btn">
              Register
            </Link>
            <button
              className="nav-btn theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}
