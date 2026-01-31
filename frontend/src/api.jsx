import axios from "axios"

const api = axios.create({
  baseURL: "https://books-tracker-51b2.onrender.com",
  withCredentials: true
})

export default api
