import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  timeout: 1000
})

export const pingOtp = () => api.get("/ping-otp")

export const ping = () => api.get("/ping-otp")
