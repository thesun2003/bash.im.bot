'use strict'
const app = require('express')();
const bodyParser = require('body-parser')
const Bot = require('messenger-bot')
var config = require('config');
var qp = require('q');

var get_random_quote = require('../server/lib')

const max_message_size = 450; // just in case

let quick_replies = [
  {
    "content_type":"text",
    "title":"Abbys",
    "payload":"abbys"
  },
  {
    "content_type":"text",
    "title":"Top10",
    "payload":"top_10"
  }
];

let bot = new Bot({
  token: process.env.PAGE_ACCESS_TOKEN ? process.env.PAGE_ACCESS_TOKEN : config.get('pageAccessToken'),
  verify: process.env.VERIFY_TOKEN ? process.env.VERIFY_TOKEN : config.get('verifyToken'),
  app_secret: process.env.APP_SECRET ? process.env.APP_SECRET : config.get('appSecret')
})

console.log(process.env.APP_SECRET ? process.env.APP_SECRET : config.get('appSecret'));

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply, actions) => {
  let text = payload.message.text;
  actions.markRead();
  actions.setTyping(true);

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

      get_random_quote()
        .then( (result) => {
          var message = result;
          var hascut = false;

          if (message.length > max_message_size) {
            message = result.substr(0, max_message_size) + '...';
            hascut = true;
          }

          reply({ text: message, quick_replies: quick_replies}, (err, info) => {
            if (hascut) {
              message = '...' + result.substr(max_message_size);
              reply({ text: message, quick_replies: quick_replies });
            }
          })

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