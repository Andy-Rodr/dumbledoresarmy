let request = require('request')
var cinemas_list = require('./cinemas_from_search')

//// Converting zip code to lat long

var options = {
	method: "GET",
	url: "https://maps.googleapis.com/maps/api/geocode/json?address=90723"
}

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var parsed = JSON.parse(body)
  var location = parsed.results[0].geometry.location
  //console.log(location)
  var lat = location.lat
  lat = lat.toFixed(2)
  var lng = location.lng
  lng = lng.toFixed(2)
  //console.log("lat: " + lat + " lng: " + lng)

  //// Making a get request to ishowtimes

  var properties = {
  	"location": lat.toString() + "," + lng.toString(),
  	"distance": "10",
  	"movie_id": "45714"
  }
  var headers_obj = {
  	"X-Api-Key": "fvz6gU0nOgf19S32D1pJg1wVuTR26u90"
  }

  options ={
  	headers: headers_obj,
  	method: "GET",
  	url: "https://api.internationalshowtimes.com/v4/showtimes/",
  	qs: properties
  }
  request(options, function (error, response, body) {

    if (error) throw new Error(error);

  	var cinemas = []

  	var parsed = JSON.parse(body)

  	//console.log(parsed)
  	
    var showtimes = parsed.showtimes //array of showtimes
    console.log(showtimes[0])

    var cinemas_and_showtimes = []

    for(i = 0; i < showtimes.length; i++){ //iterate through showtimes

      var cinemaid = showtimes[i].cinema_id  // getting cinema_id from showtime

      var cinemaid_index =  -1//cinemas_and_showtimes.indexOf(cinemaid) // index of cinema_id if present in cinemas_and_showtimes

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
      else{

        cinemas_and_showtimes[cinemaid_index][1].push(showtimes[i]) // if it does exist, push to the index
                                                                    // with cinema_id as its first value
      }

    } // end of creating showtimes array by cinema_id

    // console.log(JSON.stringify(cinemas_and_showtimes))

    //ultimately want to be able to display the cinema name + showtimes

    var cinema_names_showtime_details = []

    for(k = 0; k < cinemas_and_showtimes.length; k++){

      var cid = cinemas_and_showtimes[k][0]
      var cname = cinemas_list.cinemas[cid].name
      var ctel = cinemas_list.cinemas[cid].telephone
      var cweb = cinemas_list.cinemas[cid].website
      var cadd = cinemas_list.cinemas[cid].location.address.display_text
      var start_times = []

      for(l = 1; l < cinemas_and_showtimes[k][1].length; l++){
        start_times.push(cinemas_and_showtimes[k][1][l].start_at)
      }
      //cinemas_and_showtimes[k][1].start_at

      cinema_names_showtime_details.push(
        [cname, start_times, [cname,ctel,cweb,cadd]]
      )
    }

    console.log(cinema_names_showtime_details)
  	
  })
})


// How the array will look
//  [
//    [
//      cinema_id: "000000",
//      showtimes: [
//        {st},
//        {st}
//      ]
//    ],
//  
//    [
//      cinema_id: "000000",
//      showtimes: [
//        {st},
//        {st}
//      ]
//    ]
//  ]


// bryan 3620

// 12:00 - 1:30
// 1280 room 10 lew wasseerman