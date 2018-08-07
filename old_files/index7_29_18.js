//7_29_18

console.log('Bot is starting')

const express = require('express')
const path = require('path')
let PORT = process.env.PORT || 5000

let bodyParser = require("body-parser")
let hmac = require('./security')
let config = require('./config')
let util = require('util')
let request = require('request')

let project_id = 'reviewsbot-7c342'

express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .get("/", (req, res) => {
    res.send("index page")
  })
  .post("/webhooks/twitter", (req, res) => {
    var session_id = req.body.session
    var intent = req.body.queryResult.intent.displayName
    //console.log(req.body.queryResult)

    if(intent === "Movies"){
      var movie = req.body.queryResult.parameters.movie
      res.send(
        {
          fulfillmentText: "What would you like to view for " + movie + "?"
        }
      )
    }
    else if(intent === "Movie-Options"){

      var movie_option = req.body.queryResult.parameters.movieOptionsSelection
      var movie = req.body.queryResult.parameters.movie

      var contexts = req.body.queryResult.outputContexts

      //console.log(contexts)
      // for(i=0;i<contexts.length;i++){
      //   if(contexts[i].parameters.movie){
      //     var movie = contexts[i].parameters.movie
      //   }
      // }
      }

      if(movie_option === 'merch'){
        res.send(
          {
            fulfillmentText: movie_option + " for " + movie + "\n\nWould you like to know more about this movie?"
          }
        )
      }
      else if(movie_option === 'reviews'){
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
              //console.log(reviews_json[random])
              var random_review = reviews_json[random].reviewBody
              var author = reviews_json[random].author.name
              res.send(
                {
                  fulfillmentText: author + " says:\n" + random_review + "\n\nWould you like to know more about this movie?"
                }
              )
            })
        })
      }
      else if(movie_option === 'showtimes'){
        res.send(
          {
            fulfillmentText: movie_option + " for " + movie + "\n\nWould you like to know more about this movie?"
          }
        )
      }
      else if(movie_option === 'tickets'){
        // res.send(
        //   {
        //     fulfillmentText: movie_option + " for " + movie + "\n\nWould you like to know more about this movie?"
        //   }
        // )
        var movie = req.body.queryResult.parameters.movie

        var options = {
          method: 'GET',
          url: 'https://www.rottentomatoes.com/search/?search='+movie
        }

        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          var start_search_substr = '"movies":['
          var start_index = body.indexOf(start_search_substr) + start_search_substr.length - 1
          var end_search_substr = '"tvCount":'
          var end_index = body.indexOf(end_search_substr) - 1
          var parsed = JSON.parse(body.substring(start_index, end_index))
          res.set('Content-Type', 'application/json')
          res.send(
          {


            fulfillmentMessages: [
              {
                card:{
                  title: "Fandango page for " + movie,
                  imageUri: parsed[0].image,
                  buttons: [
                    {
                      text: "Find tickets here",
                      postback: ('https://www.rottentomatoes.com' + parsed[0].url)
                    }
                  ]
                }
              },
              {
                text:{
                  text:[
                    "Would you like to view more about " + movie + "?"
                  ]
                }
              },
            ]


          })
        })
      } // end tickets intent

  })


  .get("/webhooks/twitter", (req, res) => {
    res.send({
      "response_token": "sha256="+hmac.get_challenge_response(req.query.crc_token, config.consumer_secret)
    })
  })
  .listen(PORT, () => console.log(util.format('Listening on PORT %s', String(PORT))))