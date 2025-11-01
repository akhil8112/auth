import { useState, useEffect } from "react"
import "../App.css"

const mockBooks = [
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", imageUrl: "https://m.media-amazon.com/images/I/81gepf1eMqL.jpg" },
  { id: 2, title: "1984", author: "George Orwell", imageUrl: "https://m.media-amazon.com/images/I/61HkdyBpKOL._AC_UF1000,1000_QL80_.jpg" },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", imageUrl: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1738790966i/4671.jpg" },
  { id: 4, title: "Moby Dick", author: "Herman Melville", imageUrl: "https://m.media-amazon.com/images/I/71K4OH9CqOL._UF1000,1000_QL80_.jpg" },
  { id: 5, title: "Pride and Prejudice", author: "Jane Austen", imageUrl: "https://m.media-amazon.com/images/I/81Scutrtj4L._UF1000,1000_QL80_.jpg" },
  { id: 6, title: "The Hobbit", author: "J. R. R. Tolkienr", imageUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSIC_YPq_jj05OEf4_81GapvNyIDgDPr90P2JqEULam7brt12Sr" },
  { id: 7, title: "Atomic Habits", author: "James Clear", imageUrl: "https://jamesclear.com/wp-content/uploads/2025/06/atomic-habits-dots.png" },
  { id: 8, title: "The Color Purple", author: "Alice Walker ", imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSpcIS-wwwnKJIK1V5Pfcfgg4uqaGPfRHFyPg-L-7Mfe1FxMAWS" },
  { id: 9, title: "Brave New World", author: " Aldous Huxley", imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSpcIS-wwwnKJIK1V5Pfcfgg4uqaGPfRHFyPg-L-7Mfe1FxMAWS" },
]

export default function Welcome({ username, fullname, setToken, cart, setCart }) {
  const [msg, setMsg] = useState("")
  const [userBooks, setUserBooks] = useState(() => {
    const saved = localStorage.getItem("userBooks")
    return saved ? JSON.parse(saved) : []
  })
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    localStorage.setItem("userBooks", JSON.stringify(userBooks))
  }, [userBooks])

  useEffect(() => {
    localStorage.setItem("readingCart", JSON.stringify(cart))
  }, [cart])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("fullname")
    setToken(null)
    window.location.href = "/login"
  }

  const addToCart = (book) => {
    if (!cart.find((item) => item.id === book.id)) {
      const updated = [...cart, book]
      setCart(updated)
      setMsg(`✅ Added "${book.title}" to cart!`)
    } else {
      setMsg(`⚠️ "${book.title}" is already in your cart.`)
    }
    setTimeout(() => setMsg(""), 3000)
  }

  const removeFromCart = (bookId) => {
    const updated = cart.filter((item) => item.id !== bookId)
    setCart(updated)
  }

  // ✅ New function to remove user-added book
  const removeUserBook = (bookId) => {
    const updated = userBooks.filter((book) => book.id !== bookId)
    setUserBooks(updated)
    setMsg("🗑️ Book removed from your custom list.")
    setTimeout(() => setMsg(""), 2000)
  }

  const addCustomBook = (e) => {
    e.preventDefault()
    if (!title.trim() || !author.trim()) {
      setMsg("⚠️ Please provide both title and author.")
      return
    }

    const newBook = {
      id: Date.now(),
      title,
      author,
      imageUrl:
        imageUrl.trim() ||
        "https://placehold.co/100x150/cccccc/FFFFFF?text=Custom+Book",
    }

    const updatedBooks = [...userBooks, newBook]
    setUserBooks(updatedBooks)
    setTitle("")
    setAuthor("")
    setImageUrl("")
    setMsg(`✅ Added "${newBook.title}" to your custom library!`)
    setTimeout(() => setMsg(""), 3000)
  }

  return (
    <div className="page-container">
     
      {msg && <div className="feedback-msg">{msg}</div>}

      {/* Available Books */}
      <div className="library-section">
        <h3>Available Books</h3>
        <div className="book-list">
          {mockBooks.map((book) => (
            <div key={book.id} className="book-card">
              <img src={book.imageUrl} alt={book.title} className="book-cover-img" />
              <div className="book-details">
                <strong>{book.title}</strong>
                <span>by {book.author}</span>
                <button onClick={() => addToCart(book)} className="btn-add-cart">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Book */}
      <div className="library-section">
        <h3>➕ Add Your Own Book</h3>
        <form className="book-form" onSubmit={addCustomBook}>
          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <button type="submit" className="btn-add-cart">
            Add Book
          </button>
        </form>

        {/* ✅ Custom Book List with remove button */}
        <div className="book-list">
          {userBooks.length === 0 ? (
            <p>No custom books added yet.</p>
          ) : (
            userBooks.map((book) => (
              <div key={book.id} className="book-card">
                <img src={book.imageUrl} alt={book.title} className="book-cover-img" />
                <div className="book-details">
                  <strong>{book.title}</strong>
                  <span>by {book.author}</span>
                  <div className="book-actions">
                    <button onClick={() => addToCart(book)} className="btn-add-cart">
                      Add to Cart
                    </button>
                    <button onClick={() => removeUserBook(book.id)} className="btn-remove-cart">
                      Remove 
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reading Cart */}
      <div className="library-section cart-section">
        <h3>🛒 Your Reading Cart</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((book) => (
            <div key={book.id} className="book-card cart-item">
              <img src={book.imageUrl} alt={book.title} className="book-cover-img" />
              <div className="book-details">
                <strong>{book.title}</strong>
                <span>by {book.author}</span>
                <button onClick={() => removeFromCart(book.id)} className="btn-remove-cart">
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
