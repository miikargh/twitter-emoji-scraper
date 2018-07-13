const fs = require('fs')
const Twitter = require('twitter')
const creds = require('./secrets.json')
const emojiFile = './deepmoji_emojis.txt'
const lineCounterFile = './current_line_count.txt'
const maxFileLineCount = 10000

const client = new Twitter(creds)
const emojis = fs.readFileSync(emojiFile, 'utf8')
const params = {
    track: emojis,
    language: 'fi',
}

const counts = fs.readFileSync(lineCounterFile).toString().split(',').map(Number)
let lineCounter = counts[0]
let fileCounter = counts[1]

const saveTweetObjectToFile = (tweetObj) => {
    const tweetJSON = JSON.stringify(tweetObj)

    if (lineCounter >= maxFileLineCount) {
        lineCounter = 0
        fileCounter += 1
    }

    fs.appendFileSync('./data/deepmoji_tweets_'+ fileCounter +'.txt', tweetJSON + '\n')
    fs.writeFileSync(lineCounterFile, lineCounter.toString() + ',' + fileCounter.toString())

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
