var express = require("express"),
	app = express(),
	path = require('path'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	ROOT_DIRECTORY = __dirname,
	ASSETS_DIRECTORY = path.join(ROOT_DIRECTORY, 'public'),
	flash = require('connect-flash'),
	passport = require('passport');

app.use(express.static(ASSETS_DIRECTORY));
app.use(express.bodyParser());
app.use(logger('dev'));
app.use(cookieParser());
app.use(flash());

app.use(session({
	secret: process.env.SESSION_SECRET,
	store: new MongoStore({
		url: process.env.MONGO_CONNECTION_STRING
	})
}));

app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.send(200);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log("Listening on " + port);
});