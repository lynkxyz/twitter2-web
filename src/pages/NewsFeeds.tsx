import React, { useState, useEffect } from "react"
import { AuthStore } from "../stores/AuthStore"
import { getTweets, createLike } from "../services/tweet.service"
import useAsyncEffect from "use-async-effect"
import moment from "moment"

type Props = {
  authService: any
}

const Tweet = ({ data }) => {
  return (
    <div>
      <p>{data.user.username}</p>
      <p>{moment(data.inserted_at).fromNow()}</p>
      <p>{data.content}</p>
    </div>
  )
}

export const NewsFeeds: React.FC<Props> = props => {
  const [tweets, setTweets] = useState([])

  useAsyncEffect(async () => {
    await onGetTweets()
  }, [])

  async function onGetTweets(params = {}) {
    try {
      const result = await getTweets(params)
      console.log(result.data)
      setTweets(result.data.data)
    } catch (e) {
      console.log(e)
    }
  }

  async function onLike(tweet_id: number) {
    try {
      const result = await createLike(tweet_id)
      setTweets(tweets.map(t => ({ ...t, like_count: t.like_count + 1 })))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <h1>Hello</h1>
      <button
        onClick={() => {
          AuthStore.logout()
        }}
      >
        Logout
      </button>
      <p>
        <button onClick={() => onGetTweets({})}>Clear</button>
        <button onClick={() => onGetTweets({ sort_by: "like_count-1" })}>
          Most Like
        </button>
        <button onClick={() => onGetTweets({ sort_by: "like_count-0" })}>
          Lowest Like
        </button>
      </p>
      <div>
        {tweets.map((t, index) => (
          <div key={index}>
            {t.original_tweet && <p>Retweet by {t.user.username}</p>}
            <Tweet data={t.original_tweet ? t.original_tweet : t} />

            <button onClick={() => onLike(t.id)}>Like {t.like_count}</button>
            <button>Retweet {t.retweet_count}</button>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}
