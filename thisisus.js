console.log('the bot is starting!');
var Twit = require('twit');
var config = require('./config');
var fs = require('fs');
var T = new Twit(config);
var csvhelp = require('./helper_functions');


function getThisIsUs(){
	fs.writeFile('trying.csv', '', function(err) {
		if (err) throw err;
		else console.log('File now blank.');
	});

	var d = new Date;
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var day = d.getDay() + 1;

	if(month < 10){
		month = "0" + String(month);
	}

	if(day < 10){
		day = "0" + String(day);
	}

	//var date = String(year) + "-" + month + "-" + day;
	var date = '2017-12-01';
	var query = '#thisisus since:' + date;//date;
	T.get('search/tweets', { q: query, count: 10 }, function(err, data, response) {
		//console.log(data.statuses[0]); //uncomment this and run to see the individual tweet objects for reference
		//console.log(response);
		var tweet_list = [];
		for(var i=0; i < data.statuses.length; i++){
			tweet_list.push([data.statuses[i].user.name, data.statuses[i].text]);
		}
		console.log(tweet_list);

		var csvstring = csvhelp.convertCsv('username,tweet_text', tweet_list);
		console.log(csvstring);

		fs.writeFile('trying.csv', csvstring, function(err) {
			if (err) throw err;
			else console.log('Replaced!');
		});
	});
}

exports.thisIsUs = getThisIsUs;