"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "../styles/ResetPassword.css"
import WhatsAppButton from "../components/WhatsAppButton"
import { createAxiosInstance } from "../config/axios" // Import the API instance
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const api = createAxiosInstance()

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState("")
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search)
    const resetToken = queryParams.get("token")

    if (!resetToken) {
      toast.error("Invalid reset link")
    } else {
      setToken(resetToken)

    }
  }, [location])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("handleSubmit called")

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await api.put(`/api/v1/password_resets/${token}`, {
        password: formData.password,
      })

      console.log("Reset password response:", response.data)
      toast.success("Password has been reset successfully!")

      // Wait for the success message to be shown before redirecting
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      console.error("Reset password error:", error)
      let errorMessage = "Failed to reset password. Please try again."

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      }

      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="reset-password-container">
        <div className="reset-password-content">
          <div className="reset-password-header">
            <h1>Create New Password</h1>
            <p>Please enter your new password</p>
          </div>

          <form className="reset-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            <button type="submit" className="reset-button" disabled={loading}>
              {loading ? <>Resetting Password...</> : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
      <WhatsAppButton />
    </>
  )
}

export default ResetPassword

