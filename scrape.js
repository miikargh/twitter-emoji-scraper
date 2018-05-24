const fs = require('fs')
const Twitter = require('twitter')
const creds = require('./secrets.json')
const emojiFile = './emojis.txt'
const tweetFile = './tweets.txt'

const client = new Twitter(creds)
const emojis = fs.readFileSync(emojiFile, 'utf8')
const params = {
    track: emojis,
    language: 'fi',
}
const saveTweetToFile = (filename, tweet) => {
    const noBrakes = tweet.replace(/\n/gm,'')
    fs.appendFileSync(filename, noBrakes + '\n')
}

client.stream('statuses/filter.json', params, stream => {

    stream.on('data', e => {
        if (e && e.text) {
            saveTweetToFile(
                tweetFile,
                e.extended_tweet ? e.extended_tweet.full_text : e.text
            )
        }
    })

    stream.on('error', err => {
        console.log(err)
    })
})
