var cinemas = require('./cinemas')
let fs = require('fs')

var newobject = {}

for(i=0;i<cinemas.cinemas.length;i++){
	var id = cinemas.cinemas[i].id
	console.log(id)
	newobject[id] = cinemas.cinemas[i]
}

fs.writeFile('cinemas_from_search.js', "exports.cinemas = [" + JSON.stringify(newobject) + "]"
  	, function (err) {if (err) throw err;})