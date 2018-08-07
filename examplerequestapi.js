

var options = {
  method: 'GET',
  url: 'https://www.rottentomatoes.com/search/?search=Jurassic+World'
}

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var start_search_substr = '"movies":['
  var start_index = body.indexOf(start_search_substr) + start_search_substr.length - 1
  var end_search_substr = '"tvCount":'
  var end_index = body.indexOf(end_search_substr) - 1
  var parsed = JSON.parse(body)
  console.log(
  {
    
    fulfillmentMessages: [
      {
        card:{
          title: "What would you like to view for " + movie + "?",
          buttons: [
            {
              text: "Find tickets here",
              postback: ('https://www.rottentomatoes.com' + parsed[0].url)
            }
          ]
        }
      }
    ]
  })
}