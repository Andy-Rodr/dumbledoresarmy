console.log('the bot is starting');
var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);
var stream = T.stream('user');
stream.on('follow', followed);

//tweetIt('This is Us!');

function followed(eventMsg){
	console.log("Follow event!")
	var name = eventMsg.source.name;
	var screenName = eventMsg.source.screen_name;
	tweetIt('.@' + screenName + 'thank you for follwing');
}
console.log('check0');
tweetSetInterval();
console.log('check1');
setInterval(tweetSetInterval, 1000*5000);
console.log('check2');
function tweetSetInterval(){
	var r = Math.floor(Math.random()*100);
	tweetIt('#'+ r + '   Watch #ThisIsUs now at https://www.nbc.com/this-is-us');
}

function tweetIt(txt){
	var tweet = {
		status: txt
	}
	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
		if(err){
			console.log('something went wrong')
		}else{
			console.log('it worked')
		}
	}
}

//thank you for following
//post a tweet
//
