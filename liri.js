require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var keys = require("./keys")
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotifyKeys);
var userCommand = process.argv[2];
var userInputs = process.argv[3];
switch (userCommand) {
	case "movie-this":
		movie();
		break;
	case "spotify-this-song":
		spotifyS();
		break;
	case "concert-this":
		bands();
		break;
	case "do-what-it-says":
		doRandom();
		break;
}
function mkValue(a, b) {	
	userCommand = a;
	userInputs = b;
}
function movie() {
	if (userInputs == undefined) {
		userInputs = "Mr. Nobody"
	}
	var queryUrl = "http://www.omdbapi.com/?t=" + userInputs + "&y=&plot=short&apikey=trilogy";
	axios.get(queryUrl).then(function (response, err) {
		if (err) {
			return console.log('Error occurred: ' + err);
		} else {
			console.log(JSON.stringify("Movie name:" + response.data.Title));
			console.log(JSON.stringify("Released Year:" + response.data.Year));
			console.log(JSON.stringify("IMBD Rating:" + response.data.imdbRating));
			console.log(JSON.stringify("Rotten Tomato Rating:" + response.data.Ratings[1].Value));
			console.log(JSON.stringify("Country where the movie was produced:" + response.data.Country));
			console.log(JSON.stringify("Language:" + response.data.Language));
			console.log(JSON.stringify("Plot:" + response.data.Plot));
			console.log(JSON.stringify("Actors:" + response.data.Actors));
		}
	})

};
function spotifyS(input) {
	if (userInputs === undefined) {
		userInputs = "the sign" + " ace of base.";
	} spotify.search({ type: 'track', query: userInputs, }, function (err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		} else {
			for (var i = 0; i < data.tracks.items.length; i++) {
				console.log("Song(s):" + JSON.stringify(data.tracks.items[i].name, null, 2));
				console.log("Album:" + JSON.stringify(data.tracks.items[i].album.name, null, 2));
				console.log("Artist(s):" + JSON.stringify(data.tracks.items[i].artists[i].name, null, 2));
				console.log("Preview:" + JSON.stringify(data.tracks.items[i].external_urls.spotify, null, 2));
			}
		}

	});
}
function bands() {
	var queryUrl = "https://rest.bandsintown.com/artists/" + userInputs + "/events?app_id=codingbootcamp&date=upcoming"
	axios.get(queryUrl).then(function (response, err) {
		if (response.data[0] == undefined) {
			console.log("Oops! Seems like they are not on tour right now")
		} else {
			for (var i = 0; i < response.data.length; i++) {
				console.log(moment(response.data[i].datetime).format('MMMM Do YYYY, h:mm:ss a'));
				console.log(JSON.stringify(response.data[i].venue.name, null, 2));
				console.log(JSON.stringify(response.data[i].venue.region, null, 2));
			}

		}
	})
}
function doRandom() {
	fs.readFile("random.txt", "utf8", function (error, data) {
		if (error) {
			return console.log(error);
		}
		var dataArr = data.split(",");
		mkValue(dataArr[0], dataArr[1]);
		console.log(process.argv[2]);
		console.log(process.argv[3]);
	})
}

