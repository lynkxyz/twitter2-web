import React, { useState, useEffect, Suspense } from "react"
import { Box, Button, Heading, Grommet } from "grommet"
import { Notification } from "grommet-icons"
import { Router, View } from "react-navi"
import { routes } from "./routes"
import { AuthStore } from "./stores/AuthStore"

const App: React.FC = () => {
  let [currentUser, setCurrentUser] = useState(() => AuthStore.getCurrentUser())

  // Subscribe that state to the value emitted by the auth service
  useEffect(() => AuthStore.subscribe(setCurrentUser), [])

  return (
    <Router routes={routes} context={{ currentUser }}>
      <Suspense fallback={null}>
        <View />
      </Suspense>
    </Router>
  )
}

export default App
