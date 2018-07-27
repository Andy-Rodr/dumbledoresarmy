var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);
var csv = require('csv');
var fs = require('fs');

function getSuggestedTweets(){
	political_tweets = T.get('users/suggestions/:slug', { slug: 'political' }, function (err, data, response) {
    console.log(data);
});
}

//
//  search twitter for all tweets containing the word 'banana' since July 11, 2011
//
// Get political tweets from the nbc twitter
function getPolilticalTweets(){
	T.get('search/tweets', {q: '#politics since: 2017-12-01', count: 10}, function(err, data, response) {
		var tweet_list = []
		for(var i=0; i < data.statuses.length; i++){
			tweet_list.push([data.statuses[i].user.name, data.statuses[i].text]);
		}
		console.log(tweet_list);

	});
}
// see how well recieved the tweet is
// ^ 'make sure to add #Yes or #Noway in your comments/retweets!'
// the #s in retweets will help analyze what's going on in each tweet
// since getting the number of retweets is easy
// export tweets to csv so they can be processed later


//thank you for following
//post a tweet
//
