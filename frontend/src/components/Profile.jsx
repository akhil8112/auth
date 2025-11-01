import { useEffect, useState } from "react"
import api from "../api"

export default function Profile({ token }) {
  const [data, setData] = useState("")

  useEffect(() => {
    if (!token) return
    api.get("/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setData(res.data.msg))
    .catch(() => setData("Unauthorized or token expired"))
  }, [token])

  return (
    <div>
      <h2>Profile</h2>
      <p>{data || "Loading..."}</p>
    </div>
  )
}
