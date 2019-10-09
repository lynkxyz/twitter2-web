import { api } from "./base.service"

export const getTweets = (params = {}) =>
  api.get("/tweets", {
    params
  })

export const createLike = (tweet_id: number) =>
  api.post("/likes", { like: { tweet_id } })
