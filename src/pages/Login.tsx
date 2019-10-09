import React, { useState } from "react"
import { signIn } from "../services/auth.service"
import { AuthStore } from "../stores/AuthStore"
import { api } from "../services/base.service"
import { useNavigation } from "react-navi"

type Props = {
  authService: any
}

export const Login: React.FC<Props> = props => {
  const [email, setEmail] = useState("linh1@gmail.com")
  const [password, setPassword] = useState("123456")
  const navigation = useNavigation()

  async function onLogin() {
    try {
      const payload = await signIn({ email, password })
      api.defaults.headers["Authorization"] = `Bearer ${payload.data.token}`
      AuthStore.login(payload.data)
      navigation.navigate("/otp")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <input
        placeholder="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={onLogin}>Login</button>
    </div>
  )
}
