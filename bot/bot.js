'use strict'
const app = require('express')();
const bodyParser = require('body-parser')
const Bot = require('messenger-bot')
var config = require('config');
var qp = require('q');

var get_random_quote = require('../server/lib')

const max_message_size = 450; // just in case

let bot = new Bot({
  token: config.get('pageAccessToken'),
  verify: config.get('verifyToken'),
  app_secret: config.get('appSecret')
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply, actions) => {
  let text = payload.message.text;
  actions.setTyping(true);

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

      // reply({ text: 'секундочку..' })

      get_random_quote()
        .then( (result) => {
          var message = result;
          var hascut = false;

          if (message.length > max_message_size) {
            message = result.substr(0, max_message_size) + '...';
            hascut = true;
          }

          reply({ text: message}, (err, info) => {
            if (hascut) {
              message = '...' + result.substr(max_message_size);
              reply({text: message});
            }
          })

          // console.log(`Replied back to ${profile.first_name} ${profile.last_name}: ${result}`)
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