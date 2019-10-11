import { compose, map, mount, redirect, route, withView } from "navi"
import React from "react"
import BusyIndicator from "react-busy-indicator"
import { View, NotFoundBoundary, useLoadingRoute } from "react-navi"
import { pingOtp, ping } from "./services/base.service"
import get from "ts-get"

export function withAuthentication(matcher: any, isOtpPage = false) {
  return map(async (request, context: any) => {
    try {
      const payload = isOtpPage ? await pingOtp() : await ping()
      const isPong = get(payload, o => o.data.value, "") === "pong"

      if (context.currentUser && isPong) {
        return matcher
      }

      return redirect(
        "/login?redirectTo=" +
          encodeURIComponent(request.mountpath + request.search)
      )
    } catch (e) {
      return redirect(
        "/login?redirectTo=" +
          encodeURIComponent(request.mountpath + request.search)
      )
    }
  })
}

export const Layout = ({ children }) => {
  const loadingRoute = useLoadingRoute()
  return (
    <div>
      <BusyIndicator
        isBusy={!!loadingRoute}
        delayMs={100}
        color="red"
        className=""
        style={{}}
        active={!!loadingRoute}
      />
      <h1>Twitter2</h1>

      <main>
        <NotFoundBoundary render={() => <h1>404 - Not Found</h1>}>
          {children}
        </NotFoundBoundary>
      </main>
    </div>
  )
}

export const routes = compose(
  withView((req, ctx) => (
    <Layout>
      <View />
    </Layout>
  )),
  mount({
    "/login": map(async (request, context: any) => {
      return context.currentUser
        ? redirect(
            request.params.redirectTo
              ? decodeURIComponent(request.params.redirectTo)
              : "/otp"
          )
        : route({
            title: "Login",
            getView: async (req, context: any) => {
              const { Login } = await import("./pages/Login")
              return <Login authService={context.authService} />
            }
          })
    }),
    "/otp": withAuthentication(
      route({
        title: "Otp",
        getView: async (req, context: any) => {
          const { OtpVerify } = await import("./pages/OtpVerify")
          return <OtpVerify authService={context.authService} />
        }
      }),
      true
    ),
    "/newsfeeds": withAuthentication(
      route({
        title: "Hello",
        getView: async (req, context: any) => {
          const { NewsFeeds } = await import("./pages/NewsFeeds")
          return <NewsFeeds authService={context.authService} />
        }
      })
    ),
    "/": redirect("/login"),
    "/not-found": route({
      title: "404",
      getView: async (req, context: any) => {
        const { NotFound } = await import("./pages/NotFound")
        return <NotFound authService={context.authService} />
      }
    })
  })
)
