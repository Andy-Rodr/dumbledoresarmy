//converting to api v1

console.log('Bot is starting')

const express = require('express')
const path = require('path')
let PORT = process.env.PORT || 5000

let bodyParser = require("body-parser")
let hmac = require('./security')

let util = require('util')
let request = require('request')
let fs = require('fs')

let project_id = 'reviewsbot-7c342'

express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .get("/", (req, res) => {
  	res.send("index page")
  })
  .post("/webhooks/twitter", (req, res) => {
    console.log(req.body)
    var session_id = req.body.sessionId
    var intent = req.body.result.metadata.intentName
    //console.log(req.body.queryResult)

    if(intent === "Movie-Merch-Type"){
      var movie = req.body.result.parameters.movie
      var params = req.body.result.parameters
      var merch_type = params['movie-merch-type']

      if (merch_type === 't-shirts'){

        //want to see the request from dialogflow again
        if (movie === 'Jurassic World'){
          // console.log(req.body)
          // console.log('#####SENDER#######')
          // console.log(req.body.originalDetectIntentRequest.payload.data.sender)
          // console.log('#####RECIPIENT#######')
          // console.log(req.body.originalDetectIntentRequest.payload.data.recipient)
          // console.log('#####MESSAGE#######')
          // console.log(req.body.originalDetectIntentRequest.payload.data.message)

          res.send(
            {
                "speech": "Jurassic Park 25th anniversary men's t-shirt",
                "messages": [
                  {
                    "buttons": [
                      {
                        "postback": "https://shop.universalorlando.com/p/Jurassic-Park-25th-Anniversary-Mens-T-Shirt.html",
                        "text": "Buy Now"
                      }
                    ],
                    "imageUrl": "https://shop.universalorlando.com/images/L-Jurassic-Park-25th-Anniversary-Mens-T-Shirt-MNS-JP-25-ANNV-T.JPG",
                    "platform": "facebook",
                    "subtitle": "$24.95",
                    "title": "Jurassic Park 25th anniversary men's t-shirt",
                    "type": 1
                  },
                  {
                    "platform": "facebook",
                    "replies": [
                      "Yes",
                      "No"
                    ],
                    "title": "Would you like to view more merch for " + movie + "?",
                    "type": 2
                  }


                ]
            //   fulfillmentMessages: [
            //     {
            //       card:{
            //         title: "Jurassic Park 25th anniversary men's t-shirt",
            //         imageUri: 'https://shop.universalorlando.com/images/L-Jurassic-Park-25th-Anniversary-Mens-T-Shirt-MNS-JP-25-ANNV-T.JPG',
            //         buttons: [
            //           {
            //             text: "Buy now",
            //             postback: 'https://shop.universalorlando.com/p/Jurassic-Park-25th-Anniversary-Mens-T-Shirt.html'
            //           }
            //         ]
            //       }
            //     },
            //     {
            //       card:{
            //         title: "Jurassic Park 25th anniversary men's t-shirt",
            //         imageUri: 'https://shop.universalorlando.com/images/L-Jurassic-Park-25th-Anniversary-Mens-T-Shirt-MNS-JP-25-ANNV-T.JPG',
            //         buttons: [
            //           {
            //             text: "Buy now",
            //             postback: 'https://shop.universalorlando.com/p/Jurassic-Park-25th-Anniversary-Mens-T-Shirt.html'
            //           }
            //         ]
            //       }
            //     },
            //     {
            //       text:{
            //         text:[
            //           "Would you like to view more " + movie + " merch?"
            //         ]
            //       }
            //     }
            //   ]

            }
          )
        }
      }
      else if (merch_type === 'hats'){

      }
      else if (merch_type === 'mugs'){

      }
      else if (merch_type === 'accessories'){

      }
    }
    else if(intent === 'Movie-Reviews'){
      var movie = req.body.queryResult.parameters.movie
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
    else if(intent === 'Movie-Tickets'){
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
    }

    // if(intent === "Movies"){
    //   var movie = req.body.queryResult.parameters["movie"]
    //   res.send(
    //     {
    //       fulfillmentText: "What would you like to view for " + movie + "?",
    //       fulfillmentMessages: [
    //         {
    //           card:{
    //             title: "What would you like to view for " + movie + "?",
    //             subtitle: "Please select an option.",
    //             buttons: [
    //               {
    //                 text: "reviews",
    //                 postback: "reviews"
    //               },
    //               {
    //                 text: "tickets",
    //                 postback: "tickets"
    //               },
    //               {
    //                 text: "merch",
    //                 postback: "merch"
    //               }
    //             ]
    //           }
    //         }
    //       ]
    //     }
    //   )
    // }
    // else if(intent === "TV-Shows"){
    //   var tv_show = req.body.queryResult.parameters["tv-show"]
    //   res.send(
    //     {
    //       fulfillmentText: "What would you like to view for " + tv_show + "?"
    //     }
    //   )
    // }
  })
  .listen(PORT, () => console.log(util.format('Listening on PORT %s', String(PORT))))