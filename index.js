// Things to add:
// Option to view Fandango's 'Weekend Ticket' videos


// This version requires Dialogflow API v1, you can flip the switch in
// the options for your agent.

console.log('Bot is starting')

const express = require('express')
const path = require('path')
let util = require('util')
let request = require('request')
let fs = require('fs')
let bodyParser = require("body-parser")

let PORT = process.env.PORT || 5000

let jwshirts = require("./Sarah_merch/jwshirts")
let jwhats = require("./Sarah_merch/jwhats")
let jwacces = require("./Sarah_merch/jwacces")
let jwmugs = require("./Sarah_merch/jwmugs")

let project_id = 'reviewsbot-7c342'

var cinemas_list = new Object(require('./cinemas_from_search'))


//###################################################

express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .get("/", (req, res) => {
    res.send("index page")
  })
  .post("/webhooks/twitter", (req, res) => {
    
    var intent = req.body.result.metadata.intentName

    if(intent === "Default Welcome Intent"){
      res.send(
        {
          "speech": "Hi! What movie or TV show would you like to view?",
          "messages":[
            {
              "type":0,
              "speech": "Hi! What movie or TV show would you like to view?",
              "platform": "facebook"
            },
            {
              "platform": "facebook",
              "replies": [
                "Jurassic World 2",
                "The 100",
                "Mr. Robot"
              ],
              "title": "You can pick from any of these or enter the name of the movie or TV show you would like to view",
              "type": 2
            }
          ]
        }
      )
    }

    else if(intent === "Movie-Merch-Type"){
      var movie = req.body.result.parameters.movie
      var params = req.body.result.parameters
      var merch_type = params['movie-merch-type']

      if (merch_type === 't-shirts'){

        if (movie === 'Jurassic World Fallen Kingdom'){

          res.send(
            {
              "speech": movie + " t-shirts",
              "messages": jwshirts.messages.concat(
              [{
                "platform": "facebook",
                "replies": [
                  "Yes",
                  "No"
                ],
                "title": "Would you like to view more merch for " + movie + "?",
                "type": 2
              }]
              )
            }
          )
        }
      }
      else if (merch_type === 'hats'){
        if (movie === 'Jurassic World Fallen Kingdom'){

          res.send(
            {
              "speech": movie + " hats",
              "messages": jwhats.messages.concat(
              [{
                "platform": "facebook",
                "replies": [
                  "Yes",
                  "No"
                ],
                "title": "Would you like to view more merch for " + movie + "?",
                "type": 2
              }]
              )
            }
          )
        }
      }
      else if (merch_type === 'mugs'){
        if (movie === 'Jurassic World Fallen Kingdom'){

          res.send(
            {
              "speech": movie + " mugs",
              "messages": jwmugs.messages.concat(
              [{
                "platform": "facebook",
                "replies": [
                  "Yes",
                  "No"
                ],
                "title": "Would you like to view more merch for " + movie + "?",
                "type": 2
              }]
              )
            }
          )
        }
      }
      else if (merch_type === 'accessories'){
        if (movie === 'Jurassic World Fallen Kingdom'){

          res.send(
            {
              "speech": movie + " accessories",
              "messages": jwacces.messages.concat(
              [{
                "platform": "facebook",
                "replies": [
                  "Yes",
                  "No"
                ],
                "title": "Would you like to view more merch for " + movie + "?",
                "type": 2
              }]
              )
            }
          )
        }
      }
    }
    else if(intent === 'Movie-Reviews'){
      var movie = req.body.result.parameters.movie
      var options = {
        method: 'GET',
        url: 'https://www.rottentomatoes.com/search/?search=' + movie
      }
      request(options, function (error, response, body) {
        if (error) throw new Error(error);

        //parsing
        var start_search_substr = '"movies":['
        var start_index = body.indexOf(start_search_substr) + start_search_substr.length - 1
        var end_search_substr = '"tvCount":'
        var end_index = body.indexOf(end_search_substr) - 1
        var parsed = JSON.parse(body.substring(start_index, end_index))

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
          var random_review = reviews_json[random].reviewBody
          var author = reviews_json[random].author.name
          res.send(
            {
              "speech": "Random review for " + movie,
              "messages": [
                {
                  "type": 0,
                  "platform": "facebook",
                  "speech": author + " says:\n\n" + random_review
                },
                {
                  "platform": "facebook",
                  "replies": [
                    "Yes",
                    "No"
                  ],
                  "title": "Would you like to know more about " + movie + "?",
                  "type": 2
                }
              ]

            }
          ) // End Response.send
        }) // End Request
      }) // End Request
    }
    else if(intent === 'Movie-Tickets-Location'){

      var movie = req.body.result.parameters.movie
      var lat = req.body.originalRequest.data.postback.data.lat
      var lng = req.body.originalRequest.data.postback.data.long
      
      lat = lat.toFixed(2) // Internationshowtimes API needs the lat and long
      lng = lng.toFixed(2) // to be rounded to 2 digits after the decimal.

      //// Making a get request to ishowtimes for showtimes within a range of the given lat/long

      var properties = {
        "location": lat.toString() + "," + lng.toString(),
        "distance": "10", // Can be changed. This specifies distance to search from location (in kilometers).
        "movie_id": "45714" // Hardcoded to the Mission Impossible movie ID. Another call to ishowtimes api
                            // would be needed to get the movie ID of the actual movie parameter passed from
                            // Dialogflow.
      }
      var headers_obj = {
        "X-Api-Key": "fvz6gU0nOgf19S32D1pJg1wVuTR26u90"
      }

      var options ={
        headers: headers_obj,
        method: "GET",
        url: "https://api.internationalshowtimes.com/v4/showtimes/",
        qs: properties
      }
      request(options, function (error, response, body) {

        if (error) throw new Error(error);

        var cinemas = []

        var parsed = JSON.parse(body)
        
        var showtimes = parsed.showtimes //array of showtimes

        var cinemas_and_showtimes = [] // Custom array that will transform the showtimes objects into more useful data

        for(i = 0; i < showtimes.length; i++){ //iterate through showtimes

          var cinemaid = showtimes[i].cinema_id  // getting cinema_id from showtime

          var cinemaid_index =  -1 // -1 (default) === cinemaid id not found in cinemas_and_showtimes

          for(j = 0; j < cinemas_and_showtimes.length; j++){ 
            if(cinemas_and_showtimes[j][0] === cinemaid){
              cinemaid_index = j
              break
            }

          }

          if(cinemaid_index === -1){ // if cinema_id not present
            
            cinemas_and_showtimes.push([cinemaid, [showtimes[i]]]) // if it does not exist in cinemas_and_showtimes,
                                                                   // push a new array with [cinemaid, showtime]
          }
          else{ // if cinema_id was found

            cinemas_and_showtimes[cinemaid_index][1].push(showtimes[i]) // if it does exist, push to the index
                                                                        // with cinema_id as its first value
          }

        } // end of creating cinemas_and_showtimes array

        var cinema_names_showtime_details = [] // Creating ANOTHER array that will contain cinema info as well
                                               // for the facebook card buttons. This will also get the raw
                                               // movie times from the showtimes objects.

        for(k = 0; k < cinemas_and_showtimes.length; k++){
          try{
            var cid = cinemas_and_showtimes[k][0]
            
            var ctel = cinemas_list.cinemas[cid].telephone
            var cweb = cinemas_list.cinemas[cid].website
            var cadd = cinemas_list.cinemas[cid].location.address.display_text
            var cname = cinemas_list.cinemas[cid].name

            var start_times = []

            for(l = 1; l < cinemas_and_showtimes[k][1].length; l++){    // Getting all time strings from each
              start_times.push(cinemas_and_showtimes[k][1][l].start_at) // showtimes object.
            }

            cinema_names_showtime_details.push(
              [cname, start_times, [cname,ctel,cweb,cadd]] // This will be the format of the array holding all
            )                                              // information needed to make a nice looking facebook
          }                                                // card.
          catch(error){
            continue
          }
        }

        var week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

        var response_messages = []


        for(m = 0; m < cinema_names_showtime_details.length; m++){ // Start of loop chain to convert cinema_names_showtime_details
                                                                   // array into objects to be sent back to Dialogflow
          var raw_showtimes = cinema_names_showtime_details[m][1]

          var times = []
          var days = []

          for(n = 0; n < raw_showtimes.length; n++){
            //2018-08-04T19:10:00-07:00  <----  [:10] = 2018-08-04

            var datestring = raw_showtimes[n].substring(0,10)

            var days_index = -1
            for(z = 0; z < days.length; z++){

              console.log("datestring: " + datestring)
              console.log("days[z].substring(0,10): " + days[z].substring(0,10))
              if(datestring === days[z].substring(0,10)){
                days_index = z
                break
              }
            }

            if(days_index === -1){

              days.push(datestring)

              var time = new Date(raw_showtimes[n])
              var time_day = week[time.getDay()] + " " + (time.getMonth()+1) + "/" + time.getDate()
              var minutes = time.getMinutes()
              var minutes_string = ''
              if(minutes < 10){
                minutes_string = "0" + minutes
              }
              else{minutes_string = minutes.toString()}
              var time_hourmin = (time.getHours()) + ":" + minutes_string
              times.push([time_day,time_hourmin])
            }
            else{

              console.log('was found')

              var time_index = days_index
              var time = new Date(raw_showtimes[n])
              var minutes_string = ''
              var minutes = time.getMinutes()
              if(minutes < 10){
                minutes_string = "0" + minutes
              }
              else{minutes_string = minutes.toString()}
              var time_hourmin = (time.getHours()) + ":" + minutes_string
              times[days_index].push(time_hourmin)

            }

          }

          var date_times_url_queries = ''

          for(o = 0; o < times.length; o++){

            date_times_url_queries += "&time_" + o + "=" + times[o].toString()

          }

          var cinema_messages = [
            {
              "type":4,
              "platform":"facebook",
              "payload":{
                // start payload
                "facebook":{
                  "attachment": {
                    "type": "template",
                    "payload": {
                      "template_type":"generic",
                      "sharable": true,
                      "elements":[
                        {
                          "title": cinema_names_showtime_details[m][2][0], //cinema name
                          "image_url": "https://image.ibb.co/fskHeS/blue.png",
                          "subtitle": cinema_names_showtime_details[m][2][3], //cinema address
                          "buttons":[
                            {
                              "type":"web_url",
                              "url": cinema_names_showtime_details[m][2][2], //cinema homepage
                              "title":"Web page"
                            },
                            {
                              "type":"phone_number",
                              "title":"Call",
                              "payload": cinema_names_showtime_details[m][2][1] //phone number
                            },
                            {
                              "type":"web_url",
                              "url": "https://jurassic-world-mediatech-bot.herokuapp.com/showtimes?cinema_name=" + cinema_names_showtime_details[m][0] + date_times_url_queries, //cinema homepage
                              "title":"Showtimes"
                            }
                          ]// end buttons
                        }                        
                      ]//end elements
                    }
                  }
                }
                //end fb payload
              }
            }
          ]//end array

          response_messages = response_messages.concat(cinema_messages)

        } // End of loop chain to convert cinema_names_showtime_details into custom payload
          // objects for dialogflow.

        response_messages = response_messages.concat([{
            "platform": "facebook",
            "replies": [
              "Yes",
              "No"
            ],
            "title": "Would you like to know more about " + movie + "?",
            "type": 2
        }])

        res.send({
          "speech": "Movie times",
          "messages" : response_messages
        })
        
      })
    } // End Movie Tickets Intent

    else if(intent === 'TV-Shows'){
      var params = req.body.result.parameters
      var tv_show = params['tv-show']

      var options = {
        method: 'GET',
        url: 'http://api.tvmaze.com/search/shows?q=' + tv_show
      }
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var parsed = JSON.parse(body)
        var official_site = parsed[0].show.officialSite
        var network = parsed[0].show.network.name
        var image = parsed[0].show.image.original

        res.send(
          {
            "speech": "What would you like to know about " + tv_show + "?",
            "messages": [
              {
                "type": 1,
                "platform": "facebook",
                "title": tv_show,
                "subtitle": "on " + network,
                "imageUrl": image,
                "buttons": [
                  {
                    "text": "Official Page",
                    "postback": official_site
                  }
                ],
                "lang": "en"
              },
              {
                "platform": "facebook",
                "replies": [
                  "Summary",
                  "Schedule",
                  "Merch"
                ],
                "title": "What would you like to know about " + tv_show + "?",
                "type": 2
              }
            ]
          }
        )
      })
    }

    else if(intent === 'TV-Show-Schedule'){
      var params = req.body.result.parameters
      var tv_show = params['tv-show']

      var options = {
        method: 'GET',
        url: 'http://api.tvmaze.com/search/shows?q=' + tv_show
      }
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var parsed = JSON.parse(body)
        var sched = parsed[0].show.schedule
        var time = sched['time']
        var days = sched['days']
        var network = parsed[0].show.network.name
        var timezone = parsed[0].show.network.country.timezone

        if(days.length > 0){
          if(days.length > 1){
            var days_string = days[0]
            for(i = 1; i < days.length; i++){
              days_string += ", " + days[i]
            }
          }
          else{
            var days_string = days[0]
          }
          res.send({
            "speech": "Schedule for " + tv_show +"  Time: " + time + "  Days: " + days_string + " Timezone: " + timezone + "  Network: " + network,
            "messages": [
              {
                "type": 0,
                "platform": "facebook",
                "speech": "Schedule for " + tv_show +"\n\nTime: " + time + "\nDays: " + days_string + "\nTimezone: " + timezone + "\nNetwork: " + network
              },
              {
                "type": 1,
                "platform": "facebook",
                "title": "Schedule",
                "subtitle": days_string + " " + time + " " + timezone + " on " + network,
                "imageUrl": "",
                "buttons": [],
                "lang": "en"
              },
              {
                "platform": "facebook",
                "replies": [
                  "Yes",
                  "No"
                ],
                "title": "Would you like to know more about " + tv_show + "?",
                "type": 2
              }
            ]
          })
        }
        else{
          res.send({
            "speech": "Show is not currently being aired.",
            "messages": [
              {
                "type":0,
                "platform": "facebook",
                "speech": "Show is not currently being aired."
              }
            ]
          })
        }

         //res.send end
      }) //req end
    }
    else if(intent === 'TV-Show-Summary'){
      var params = req.body.result.parameters
      var tv_show = params['tv-show']

      var options = {
        method: 'GET',
        url: 'http://api.tvmaze.com/search/shows?q=' + tv_show
      }
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var parsed = JSON.parse(body)
        var genres = parsed[0].show.genres //array
        var running = parsed[0].show.status
        var official_site = parsed[0].show.officialSite
        var runtime = parsed[0].show.runtime
        var rating = parsed[0].show.rating.average
        var network = parsed[0].show.network.name
        var summary = parsed[0].show.summary
        summary = summary.substring(3,summary.length-4)
        var image = parsed[0].show.image.medium

        var genres_string = ''
        if(genres.length > 1){
          genres_string = genres[0]
          for(i=1;i<genres.length;i++){
            genres_string += ", " + genres[i]
          }
        }
        else if(genres.length === 1){
          genres_string = genres[0]
        }

        res.send(
          {
            "speech": summary,
            "messages": [
              {
                "type": 0,
                "platform": "facebook",
                "speech": "Summary: \n" + summary
              },
              {
                "type": 0,
                "platform": "facebook",
                "speech": "Genres: " + genres_string + "\n" +
                  "Status: " + running + "\n" +
                  "Runtime: " + runtime + " mins\n" +
                  "Rating: " + rating + "\n" +
                  "Network: " + network,
              },
              {
                "platform": "facebook",
                "replies": [
                  "Yes",
                  "No"
                ],
                "title": "Would you like to know more about " + tv_show + "?",
                "type": 2
              }
            ]
          }
        )
      })
    }
  })

//////////////////////////////// Dynamic schedule html response to get requests at the /showtimes endpoint.
//////////////////////////////// This is displayed when the user asks for tickets, and clicks on 'showtimes'
//////////////////////////////// quick reply. The quick reply sends a super long url with some data to be
//////////////////////////////// parsed by the code below.

.get("/showtimes", (req, res) => {

  console.log(req.query)

  var result_html = "<!DOCTYPE html><html>"
  result_html += "<head><style>table {float:left;}</style></head><body>"

  var cinema_name = req.query['cinema_name']
  result_html += "<h1>Showtimes for " + cinema_name + "</h1>"

  for(i = 0; i < 6; i++){

    try{
      var time = req.query['time_' + i]
      var showtimes_list = time.split(',')
      var day = showtimes_list[0]

      result_html += "<table border=\"1\">"
      result_html += "<tr><th>" + day + "</th></tr>"

      for(j = 1; j < showtimes_list.length; j++){

        result_html += "<tr><td>" + showtimes_list[j] + "</td></tr>"

      }

      result_html += "</table>"

    }
    catch(error){
      break
    }

  }

  result_html += "</body></html>"

  res.send(result_html)

})

.listen(PORT, () => console.log(util.format('Listening on PORT %s', String(PORT))))