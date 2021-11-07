const router = require('express').Router()
const Twitter = require('twitter')

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_API_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_API_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET,
})

// To get trending topics...  https://api.twitter.com/1.1/trends/place.json?id=1
router.get('/trends', async (req, res, next) => {
  try {
    const id = req.query.woeid 
    const trends = await client.get('trends/place.json', {
      id,
    })
    res.send(trends) 
    // console.log(id)
  } catch (error) {
    console.log(error.message)
    next(error)
  }
})
// To get trending topics...  https://api.twitter.com/1.1/users/search.json?q=a&
router.get('/mentions', async (req, res, next) => {
  try {
    const q = req.query.searchValue
    const sample = await client.get('users/search.json?', {
      q,
    })
    res.send(sample) 
    // console.log(sample)
  } catch (error) {
    console.log(error.message)
    next(error)
  }
})
// To get trending hashtags...  https://api.twitter.com/1.1/search/tweets.json?q=from%3ACmdr_Hadfield%20%23nasa&result_type=popular
router.get('/hashtags', async (req, res, next) => {
  try {
    const q =req.query.searchHashtag
    const sample = await client.get('search/tweets.json?q=&result_type=popular', {
      q,
    })
    res.send(sample) 
    console.log(sample)
  } catch (error) {
    console.log(error.message)
    next(error)
  }
})

// This route gets the WOEID for a particular location (lat/long)
router.get('/near-me', async (req, res, next) => {
  try {
    const { lat, long } = req.query
    const response = await client.get('/trends/closest.json', {
      lat,
      long,
    })
    res.send(response)
  } catch (error) {
    console.log(error.message)
    next(error)
  }
})

module.exports = router
