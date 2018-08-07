//https://github.com/twitterdev/twitter-webhook-boilerplate-node/blob/master/example_scripts/webhook_management/add-subscription.js

var config = require('./config')
var request = require('request')


// twitter authentication
var twitter_oauth = {
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  token: config.access_token,
  token_secret: config.access_token_secret
}

var WEBHOOK_ID = config.webhood_id


// request options
var request_options = {
  url: 'https://api.twitter.com/1.1/account_activity/webhooks/' + WEBHOOK_ID + '/subscriptions.json',
  oauth: twitter_oauth
}

// POST request to create webhook config
request.post(request_options, function (error, response, body) {

  if (response.statusCode == 204) {
    console.log('Subscription added.')
  } else {
    console.log('Status code: ' + response.statusCode.toString())
    console.log('User has not authorized your app.')
  }
})