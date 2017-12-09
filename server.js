var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var passport   = require('passport')
var session    = require('cookie-session')


//this allows us to run locally OR use heroku
var PORT= process.env.PORT || 3306;

app.use(express.static(__dirname + '/public'));
// parse various different custom JSON types as JSON
app.use(bodyParser.urlencoded({extended:true}));
// parse some custom things into a buffer??
app.use(bodyParser.json({type: 'application/*+json'}))
//parse an html body into a string
app.use(bodyParser.raw({type: 'application/vnd.custom-type'}))

app.use(bodyParser.text({type: 'text/html'}))


app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


var db = require("./app/models/info.js");

//enables ejs partials
app.set('view engine', 'ejs');

require("./app/routing/apiRoutes.js")(passport, app, db);
require("./app/routing/htmlRoutes.js")(app, passport);
/*app.use(function (req, res, next) {
	res.status(404).sendFile(__dirname, '../pages/error.ejs', req.params.pic_name)
  });
  */
  app.get("*", function(request, response) {
    response.render('pages/error');
  });

db.sequelize.sync()
//db.sequelize.sync({ force:true })
.then(function() {

	app.listen(PORT,function() {
	console.log("Listening on PORT: " + PORT);
});
	console.log("Database sync!");
})
.catch(function(err) {
	console.log(err);
})
