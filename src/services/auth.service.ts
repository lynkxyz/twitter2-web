import { api } from "./base.service"

type SignInDto = {
  email: string
  password: string
}

type SignUpDto = { confirmPassword: string; username: string } & SignInDto

export const signIn = (data: SignInDto) => api.post("/sign-in", data)

export const signUp = (data: SignUpDto) => api.post("/sign-up", data)

export const signOut = () => api.post("/sign-out")

export const genOtp = () => api.post("/gen-otp")

export const verifyOtp = (otp: string) =>
  api.post("/verify-otp", {
    otp
  })
