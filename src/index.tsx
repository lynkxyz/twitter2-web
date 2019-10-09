import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { AuthStore } from "./stores/AuthStore"
import { api } from "./services/base.service"
import { isObject } from "lodash"

try {
  const rawAuth = localStorage.getItem("auth")

  if (rawAuth) {
    AuthStore.currentUser = JSON.parse(rawAuth)
    console.log(AuthStore.currentUser)
    if (isObject(AuthStore.currentUser)) {
      api.defaults.headers["Authorization"] = `Bearer ${
        (AuthStore.currentUser as any).token
      }`
    }
  }
} catch (e) {
  console.log(e)
}

ReactDOM.render(<App />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
