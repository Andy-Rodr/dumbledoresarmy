var request = require("request");
var config = require("./config")

var options = { method: 'POST',
  url: 'https://api.twitter.com/1.1/direct_messages/events/new.json',
  oauth: {
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
      token: config.access_token,
      token_secret: config.access_token_secret
  },
  headers: {'Content-Type': 'application/json' },
  body: 
   { event: 
      { type: 'message_create',
        message_create: 
         { target: { recipient_id: '735544405713551361' },
           message_data: { text: 'Hello World!' } } } },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});