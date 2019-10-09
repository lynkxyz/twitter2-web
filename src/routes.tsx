import { compose, lazy, map, mount, redirect, route, withView } from "navi"
import React from "react"
import { View } from "react-navi"

export function withAuthentication(matcher: any) {
  return map((request, context: any) =>
    context.currentUser
      ? matcher
      : redirect(
          "/login?redirectTo=" +
            encodeURIComponent(request.mountpath + request.search)
        )
  )
}
export const routes = compose(
  withView((req, ctx) => (
    <div>
      <h1>Hello Twitter2</h1>
      <View />
    </div>
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
      })
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
