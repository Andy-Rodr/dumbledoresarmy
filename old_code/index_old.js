console.log('Bot is starting')

const express = require('express')
const path = require('path')
let PORT = process.env.PORT || 5000

let bodyParser = require("body-parser")
let hmac = require('./security')
let config = require('./config')
let util = require('util')
let request = require('request')

express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .get("/", (req, res) => {
  	res.send("index page")
  })
  .post("/webhooks/twitter", (req, res) => {
  	//console.log(req.body.)
  	if(req.body.favorite_events){
  		console.log('favorite event')
  	}
  	else if(req.body.direct_message_indicate_typing_events){
  		console.log('dm typing event')
  	}
  	else if(req.body.direct_message_events){

  		// // console.log(Object.keys(req.body.direct_message_events[0]))
  		// // console.log(Object.keys(req.body.direct_message_events[0].message_create))
  		// // console.log(req.body.direct_message_events[0].message_create)
  		var recipient_id = req.body.direct_message_events[0].message_create.sender_id
      // console.log(recipient_id)

      if(parseInt(recipient_id) == config.my_id){
        console.log('message from subscribed user')
      }
      else{
    		// console.log(sender_id)

    		// console.log(req.body.direct_message_events[0].message_create.message_data.text)
        if(req.body.direct_message_events[0].message_create.message_data.text === 'Hey'){
          console.log('guy says hey')
        }

        //start request
    		var options = {
          method: 'POST',
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
                 { target: { recipient_id: recipient_id },
                   message_data: { text: 'Hello World!' } } } },
          json: true 
        }

        request(options, function (error, response, body) {
          if (error) throw new Error(error);

          console.log(body);
        });
        //end request
    	}
    }
    else {
    	//console.log(Object.keys(req.body))
    	console.log('another event')
    }
    res.send('okay')
  })
  .get("/webhooks/twitter", (req, res) => {
  	res.send({
  		"response_token": "sha256="+hmac.get_challenge_response(req.query.crc_token, config.consumer_secret)
  	})
  })
  .listen(PORT, () => console.log(util.format('Listening on PORT %s', String(PORT))))