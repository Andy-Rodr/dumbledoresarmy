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

    var movie = req.body.queryResult.parameters.movie
    var qtype = req.body.queryResult.parameters.type


    if (typed === "tickets"){
        
       if(movie === "Jurassic World" || movie === "Mamma Mia" || movie === "Skyscraper"){
        var options = {
            method: 'GET',
            url: 'https://www.rottentomatoes.com/search/?search=' + movie
        }
        console.log(options.url)
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          
            //parsing
            var start_search_substr = '"movies":['
            var start_index = body.indexOf(start_search_substr) + start_search_substr.length - 1
            var end_search_substr = '"tvCount":'
            var end_index = body.indexOf(end_search_substr) - 1
            var parsed = JSON.parse(body.substring(start_index, end_index))

            //console.log(parsed[0])

//   /m/lost_kingdom

            console.log('https://www.rottentomatoes.com' + parsed[0].url)

            var options_two = {
            method: 'GET',
            url: 'https://www.rottentomatoes.com' + parsed[0].url
            }
            request(options_two, function (error, response, body) {
                if (error) throw new Error(error);

          /////////////// EXTRA PARSING 

                res.send({
                fulfillmentText: "dupe",
                })
            })
        })
    }
}

else if (typed === "reviews"){


    if(qtype === "reviews"){
    if(movie === "Jurassic World" || movie === "Mamma Mia" || movie === "Skyscraper"){
      var options = {
        method: 'GET',
        url: 'https://www.rottentomatoes.com/search/?search=' + movie
      }
      console.log(options.url)
      request(options, function (error, response, body) {
          if (error) throw new Error(error);
          
          //parsing
          var start_search_substr = '"movies":['
          var start_index = body.indexOf(start_search_substr) + start_search_substr.length - 1
          var end_search_substr = '"tvCount":'
          var end_index = body.indexOf(end_search_substr) - 1
          var parsed = JSON.parse(body.substring(start_index, end_index))

          //console.log(parsed[0])

//   /m/lost_kingdom

          console.log('https://www.rottentomatoes.com' + parsed[0].url)

          var options_two = {
          method: 'GET',
          url: 'https://www.rottentomatoes.com' + parsed[0].url
          }
          request(options_two, function (error, response, body) {
          if (error) throw new Error(error);

            start_substr = '"review":['
            start_index = body.indexOf(start_substr) + start_substr.length - 1
            end_substr = '"image":'
            end_index = body.indexOf(end_substr) - 1

            var reviews = body.substring(start_index, end_index)

            var reviews_json = JSON.parse(reviews)

            var random = Math.floor(Math.random()*reviews_json.length)
            console.log(reviews_json[random])
            var random_review = reviews_json[random].reviewBody
            res.send(
              {
                fulfillmentText: random_review,
                // payload: {
                //   twitter:{
                //     event:{
                //       type: "message_create",
                //       message_create:{
                //         target:{
                //           recipient_id: "735544405713551361"
                //         },
                //         message_data:{
                //           text: "twitter test ok"
                //         }
                //       }
                //     }
                //   }
                // }
                // Twitter not fully integrated into DialogueFlow yet.
              }
            )
          })
        })
    }
    }else if (typed === "schedule"){
   
    }else{
       
    }
  }
})
  .get("/webhooks/twitter", (req, res) => {
    res.send({
        "response_token": "sha256="+hmac.get_challenge_response(req.query.crc_token, config.consumer_secret)
    })
  })
  .listen(PORT, () => console.log(util.format('Listening on PORT %s', String(PORT))))