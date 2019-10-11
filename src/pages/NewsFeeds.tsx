import React, { useState } from "react"
import { AuthStore } from "../stores/AuthStore"
import { getTweets, createLike, createTweet } from "../services/tweet.service"
import useAsyncEffect from "use-async-effect"
import moment from "moment"
import get from "ts-get"

type Props = {
  authService: any
}

const Tweet = ({ data, isRetweet }) => {
  return (
    <div
      style={{
        marginLeft: isRetweet ? 50 : 0
      }}
    >
      <p>{data.user ? data.user.username : ""}</p>
      <p>{moment(data.inserted_at).fromNow()}</p>
      <p>{data.content}</p>
    </div>
  )
}

export const NewsFeeds: React.FC<Props> = props => {
  const [tweets, setTweets] = useState([])
  const [tweetContent, setTweetContent] = useState("")

  useAsyncEffect(async () => {
    await onGetTweets()
  }, [])

  async function onGetTweets(params = {}) {
    try {
      const result = await getTweets(params)
      setTweets(result.data.data)
    } catch (e) {
      console.log(e)
    }
  }

  async function onLike(tweetId: number, likedByMe?: boolean) {
    try {
      await createLike(tweetId)
      setTweets(
        tweets.map(t => {
          if (tweetId === t.id) {
            return {
              ...t,
              liked_by_me: !likedByMe,
              like_count: likedByMe ? t.like_count - 1 : t.like_count + 1
            }
          }

          return t
        })
      )
    } catch (e) {
      console.log(e)
    }
  }

  async function onCreateTweet() {
    try {
      const payload = await createTweet({ content: tweetContent })
      const data = [payload.data.data].concat(tweets)
      setTweets(data)
    } catch (e) {
      console.log(e)
    }
  }

  async function onRetweet(originalTweetId: string) {
    try {
      const content = prompt("Please enter tweet content")
      const payload = await createTweet({
        content: content,
        original_tweet_id: originalTweetId
      })
      const data = [payload.data.data].concat(tweets)
      setTweets(data)
    } catch (e) {
      alert(get(e, o => o.response.data.error))
    }
  }

  return (
    <div>
      <button
        onClick={() => {
          AuthStore.logout()
        }}
        style={{ backgroundColor: "red", color: "white" }}
      >
        Logout
      </button>
      <hr />
      <p>
        <button onClick={() => onGetTweets({ sort_by: "inserted_at-1" })}>
          Clear
        </button>
        <button onClick={() => onGetTweets({ sort_by: "like_count-1" })}>
          Most Like
        </button>
        <button onClick={() => onGetTweets({ sort_by: "like_count-0" })}>
          Lowest Like
        </button>
      </p>
      <div>
        <input
          value={tweetContent}
          onChange={e => setTweetContent(e.target.value)}
          type="text"
          placeholder="Enter your tweet"
        />
        <button onClick={onCreateTweet}>Submit</button>
      </div>
      <br />
      <div>
        {tweets.map((t, index) => (
          <div key={index}>
            {t.original_tweet && <p>Retweet by {t.user.username}</p>}
            {t.original_tweet && <p>{t.content}</p>}
            {t.original_tweet && <p>{moment(t.inserted_at).fromNow()}</p>}
            <Tweet
              data={t.original_tweet ? t.original_tweet : t}
              isRetweet={!!t.original_tweet}
            />

            <button
              onClick={() => onLike(t.id, t.liked_by_me)}
              style={{
                backgroundColor: t.liked_by_me ? "tomato" : "white"
              }}
            >
              Like {t.like_count}
            </button>
            <button onClick={() => onRetweet(t.id)}>
              Retweet {t.retweet_count}
            </button>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}
