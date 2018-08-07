// interactions.js

{
	trigger = "Hey bot",
	message = "Hello there, {recipient name}\nHow can I help you today?"
	// buttons = ctas
	buttons = [
		{
			type = "web_url",
			label = "Fandango",
			url = "https://endpoint.com"
			//endpoint on express app that will 
		},
		{
			type = "web_url",
			label = "Rotten tomatoes",
			url = "https://endpoint.com"
		},
		{
			type = "web_url",
			label = "Trivia",
			url = "https://endpoint.com"
		}
	]
}

// Q: So, buttons can only be used as a one time event since it points to a url and that's all?
// A: It can be used as just a url; but since we have our own web app deployed, we can make the
//    button url a custom endpoint <-- the custom endpoint on our app will basically perform as
//    a call to a function and will send the next 
//    ^ I HOPE this will work