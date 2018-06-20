const fs = require('fs')
const Twitter = require('twitter')
const creds = require('./secrets.json')
const emojiFile = './emojis.txt'
const tweetFile = './tweets.txt'
let lineCounter = 0
let fileCounter = 0
const maxFileLineCount = 10

const client = new Twitter(creds)
const emojis = fs.readFileSync(emojiFile, 'utf8')
const params = {
    track: emojis,
    language: 'ar',
}

const saveTweetObjectToFile = (tweetObj) => {
    const tweetJSON = JSON.stringify(tweetObj)

    if (lineCounter >= maxFileLineCount) {
        lineCounter = 0
        fileCounter += 1
    }

    fs.appendFileSync('./data/tweets_'+ fileCounter +'.txt', tweetJSON + '\n')
    lineCounter++
}

client.stream('statuses/filter.json', params, stream => {

    stream.on('data', e => {
        saveTweetObjectToFile(e)
    })

    stream.on('error', err => {
        console.log(err)
    })
})
