import axios from "axios"

export const api = axios.create({
  baseURL: "https://sheltered-brook-01438.herokuapp.com/api/v1",
  timeout: 5000
})

export const pingOtp = () => api.get("/ping-otp")

export const ping = () => api.get("/ping-otp")
