import { api } from "./base.service"

export const getTweets = (params = {}) =>
  api.get("/tweets", {
    params: {
      sort_by: "inserted_at-1",
      ...params
    }
  })

type CreateTweetDto = {
  content: string
  original_tweet_id?: string
}

export const createTweet = (body: CreateTweetDto) =>
  api.post("/tweets", {
    tweet: body
  })

export const createLike = (tweet_id: number) =>
  api.post("/likes", { like: { tweet_id } })
