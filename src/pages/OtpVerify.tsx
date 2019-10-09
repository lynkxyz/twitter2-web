import React, { useState } from "react"
import { signIn, genOtp, verifyOtp } from "../services/auth.service"
import { AuthStore } from "../stores/AuthStore"
import { api } from "../services/base.service"
import { useNavigation } from "react-navi"

type Props = {
  authService: any
}

export const OtpVerify: React.FC<Props> = props => {
  const [otp, setOtp] = useState("")
  const navigation = useNavigation()

  async function onGenOtp() {
    try {
      const payload = await genOtp()
      console.log(payload)
    } catch (e) {
      console.log(e)
    }
  }

  async function onVerifyOtp() {
    try {
      const payload = await verifyOtp(otp)
      console.log(payload)
      localStorage.setItem("auth", JSON.stringify(payload.data))
      api.defaults.headers["Authorization"] = `Bearer ${payload.data.token}`
      navigation.navigate("/newsfeeds")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <input
        placeholder="otp"
        value={otp}
        onChange={e => setOtp(e.target.value)}
      />
      <button onClick={onVerifyOtp}>Verify OTP Code</button>
      <button onClick={onGenOtp}>Get OTP Code</button>
    </div>
  )
}