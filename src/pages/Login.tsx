import React, { useState } from "react"
import { signIn, signUp } from "../services/auth.service"
import { AuthStore } from "../stores/AuthStore"
import { api } from "../services/base.service"
import { useNavigation } from "react-navi"
import get from "ts-get"

type Props = {
  authService: any
}

export const Login: React.FC<Props> = props => {
  const [email, setEmail] = useState("linh@gmail.com")
  const [username, setUsername] = useState("linh")
  const [password, setPassword] = useState("123456")
  const [confirmPwd, setConfirmPwd] = useState("123456")
  const [isSignUp, setIsSignUp] = useState(false)
  const navigation = useNavigation()

  async function onSignIn() {
    try {
      const payload = await signIn({ email, password })
      api.defaults.headers["Authorization"] = `Bearer ${payload.data.token}`
      AuthStore.login(payload.data)
      navigation.navigate("/otp")
    } catch (e) {
      alert(get(e, o => o.response.data.message))
    }
  }

  async function onSignUp() {
    try {
      const payload = await signUp({
        username,
        email,
        password,
        confirmPassword: confirmPwd
      })
      api.defaults.headers["Authorization"] = `Bearer ${payload.data.token}`
      AuthStore.login(payload.data)
      navigation.navigate("/otp")
    } catch (e) {
      alert(JSON.stringify(get(e, o => o.response.data, "{}")))
    }
  }

  return (
    <div>
      <div>
        <button onClick={() => setIsSignUp(false)}>Go to Login</button>
        <span> | </span>
        <button onClick={() => setIsSignUp(true)}>Go to Signup</button>
      </div>
      <br />
      {isSignUp && (
        <input
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      )}
      <input
        placeholder="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {isSignUp && (
        <input
          placeholder="confirm password"
          type="password"
          value={confirmPwd}
          onChange={e => setConfirmPwd(e.target.value)}
        />
      )}
      <button onClick={() => (isSignUp ? onSignUp() : onSignIn())}>
        Submit
      </button>
    </div>
  )
}
