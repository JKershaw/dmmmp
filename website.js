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
	passport = require('passport'),
	util = require('util'),
	GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(new GitHubStrategy({
		clientID: process.env.GITHUB_CLIENT_ID,
		clientSecret: process.env.GITHUB_CLIENT_SECRET,
		callbackURL: process.env.GITHUB_CALLBACK_URL,
		scope: ['repo']
	},
	function (accessToken, refreshToken, profile, done) {
		// asynchronous verification, for effect...
		process.nextTick(function () {

			// To keep the example simple, the user's GitHub profile is returned to
			// represent the logged-in user.  In a typical application, you would want
			// to associate the GitHub account with a user record in your database,
			// and return that user instead.
			return done(null, profile);
		});
	}
));

// configure Express
app.configure(function () {

	app.use(express.static(ASSETS_DIRECTORY));
	app.use(logger('dev'));
	app.use(flash());

	app.use(session({
		secret: process.env.SESSION_SECRET,
		store: new MongoStore({
			url: process.env.MONGO_CONNECTION_STRING
		})
	}));

	app.set('view engine', 'ejs');

	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function (req, res) {
	res.render('index', {
		user: req.user
	});
});

app.get('/account', ensureAuthenticated, function (req, res) {
	res.render('account', {
		user: req.user
	});
});

app.get('/login', function (req, res) {
	res.render('login', {
		user: req.user
	});
});

app.get('/auth/github',
	passport.authenticate('github'),
	function (req, res) {
		// The request will be redirected to GitHub for authentication, so this function will not be called.
	});

app.get('/auth/github/callback',
	passport.authenticate('github', {
		failureRedirect: '/login'
	}),
	function (req, res) {
		res.redirect('/');
	});

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Listening on " + port);
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login')
}