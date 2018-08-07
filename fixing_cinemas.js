var cinemas = require('./cinemas.js')
let fs = require('fs')

var newobject = {}

for(i=0;i<cinemas.cinemas.length;i++){
	var id = cinemas.cinemas[i].id
	newObject[id] = cinemas.cinemas[i]
}

fs.writeFile('cinemas.json', newobject
  	, function (err) {if (err) throw err;})