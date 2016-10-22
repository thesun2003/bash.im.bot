'use strict'
const app = require('express')();
const bodyParser = require('body-parser')
const Bot = require('messenger-bot')
var config = require('config');

var get_random_quote = require('../server/lib')

let bot = new Bot({
  token: config.get('pageAccessToken'),
  verify: config.get('verifyToken'),
  app_secret: config.get('appSecret')
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    reply({ text }, (err) => {
      if (err) throw err

    get_random_quote()
      .then(function(result) {
        reply({ result }, (err) => {
          if (err) throw err
    });

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  return bot._verify(req, res)
})

app.post('/', (req, res) => {
  bot._handleMessage(req.body)
  res.end(JSON.stringify({status: 'ok'}))
})

module.exports = app;