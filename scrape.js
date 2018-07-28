let request = require('request')
// let churro = require('cheerio')
let fs = require('fs')
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// var search_dom = new JSDOM(''
// 	, {
// 		url: "https://www.rottentomatoes.com/search/?search=jurassic world",
// 		contentType: "text/html",
// 		resources: "usable"
// 	});
//   console.log(search_dom.window.document.querySelector("body"))

var movie = 'mamma mia'

var options = {
  method: 'GET',
  url: 'https://www.rottentomatoes.com/search/?search=' + movie,
  // oauth: {
  //   consumer_key: config.consumer_key,
  //   consumer_secret: config.consumer_secret,
  //   token: config.access_token,
  //   token_secret: config.access_token_secret
  // },
  // headers: {'Content-Type': 'application/json' },
  // body: 
  //  { event: 
  //     { type: 'message_create',
  //       message_create: 
  //        { target: { recipient_id: recipient_id },
  //          message_data: { text: 'Hello World!' } } } },
  // json: true 
}

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  //console.log(body);
  //var churro_body = churro.load(body);
  //var churro_results = churro_body('#search-results-root').html();
  //console.log(churro_body('div.body_main container').html())
  //console.log(churro_body('body').html())

  // fs.writeFile('body.xml', churro_body('script','.body_main').html()
  // 	, function (err) {if (err) throw err;})

  // fs.writeFile('body.xml', churro_body('html').find('.body_main').children().last().prev().prev().prev().prev().prev().prev()
  // 	, function (err) {if (err) throw err;})

  // fs.writeFile('body.xml', churro_body('html').find('.body_main').children().last().prevAll('#main_container')
  // 	, function (err) {if (err) throw err;})

  // fs.writeFile('body.xml', churro_body('html').find('.body_main').children('#main_container').children('div').children('script').html()//.children('#search-results-root').innerHTML()
  // 	, function (err) {if (err) throw err;})

  //var jscode = churro_body('html').find('.body_main').children('#main_container').children('div').children('script').html()
  var start_search_substr = '"movies":['
  // var start_index = jscode.indexOf(start_search_substr) + start_search_substr.length - 1
  var start_index = body.indexOf(start_search_substr) + start_search_substr.length - 1
  //console.log(start_index)
  var end_search_substr = '"tvCount":'
  // var end_index = jscode.indexOf(end_search_substr) - 1
  var end_index = body.indexOf(end_search_substr) - 1
  //console.log(jscode.substring(start_index, end_index))
  // var parsed = JSON.parse(jscode.substring(start_index, end_index))
  var parsed = JSON.parse(body.substring(start_index, end_index))
  //console.log(parsed[0].url)
  console.log('https://www.rottentomatoes.com' + parsed[0].url)

  var options_two = {
  method: 'GET',
  url: 'https://www.rottentomatoes.com' + parsed[0].url
  }
  request(options_two, function (error, response, body) {
  if (error) throw new Error(error);
  //var churro_body = churro.load(body);

  fs.writeFile('body.xml', body
  	, function (err) {if (err) throw err;})
  //console.log(body)

	// start_substr = '"review":['
	// start_index = body.indexOf(start_substr) + start_substr.length - 1
	// end_substr = '"image":'
	// end_index = body.indexOf(end_substr) - 1

	// var reviews = body.substring(start_index, end_index)
	
	// // console.log(start_index)
	// // console.log(end_index)
	// // console.log(reviews)

	// var reviews_json = JSON.parse(reviews)
	// //console.log(reviews_json.length)

	// var random = Math.floor(Math.random()*reviews_json.length)
	// console.log(reviews_json[random])

  })
})


// fireBaseProjects/reviewsBot/functions/test_scripts