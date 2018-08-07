var a = [1,2,3]
var b = [4,5,6]

var c = a.concat(b)

console.log(c)

// "payload":{
// // start payload
// 	"facebook":{
// 	  "attachment": {
// 	    "type": "template",
// 	    "payload": {
// 	      "template_type":"button",
// 	      "text": cinema_names_showtime_details[m][0] + "/n" + cinema_names_showtime_details[m][2][3], //cinema name
// 	      "buttons":[
// 	        {
// 	          "type":"web_url",
// 	          "url": cinema_names_showtime_details[m][2][2],
// 	          "title":"web_url example"
// 	        },
// 	        {
// 	          "type":"phone_number",
// 	          "title":"Call",
// 	          "payload": cinema_names_showtime_details[m][2][1] //phone number
// 	        }
// 	      ]
// 	    }
// 	  }
// 	}
// //end fb payload
// }