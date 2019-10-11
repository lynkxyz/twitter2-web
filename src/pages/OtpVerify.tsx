import React, { useState } from "react"
import { genOtp, verifyOtp } from "../services/auth.service"
import { api } from "../services/base.service"
import { useNavigation } from "react-navi"
import get from "ts-get"

type Props = {
  authService: any
}

export const OtpVerify: React.FC<Props> = props => {
  const [otp, setOtp] = useState("")
  const [otpHint, setOtpHint] = useState("")
  const navigation = useNavigation()

  async function onGenOtp() {
    try {
      const payload = await genOtp()
      setOtpHint(payload.data.otp)
    } catch (e) {
      alert(get(e, o => o.response.data.error))
    }
  }

  async function onVerifyOtp() {
    try {
      const payload = await verifyOtp(otp)
      localStorage.setItem("auth", JSON.stringify(payload.data))
      api.defaults.headers["Authorization"] = `Bearer ${payload.data.token}`
      navigation.navigate("/newsfeeds")
    } catch (e) {
      alert(get(e, o => o.response.data.error))
    }
  }

  return (
    <div>
      {otpHint && <span>Your OTP code is: {otpHint}</span>}
      <br />
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
