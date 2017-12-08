var path = require("path");

var authredirect = require("../routing/apiRoutes.js");

var loginAuth =require("./userSignInAuth.js");

module.exports = function(app, passport) {

	app.set('views', './views');
	app.set('view engine', 'ejs');


	app.get("/profile", loginAuth.isLoggedIn, function(req, response) {
			response.render('pages/profile');
	});

  app.get("/", function(request, response) {
    response.render('pages/index');
  });

	app.get("/toolbox", function(request, response) {
		response.render('pages/toolbox');
	});

  app.get("/signup", function(request, response) {
    response.render('pages/signUp');
  });

	app.get("/logistics", loginAuth.isLoggedIn, function(request, response) {
    response.render('pages/logistics');
  });

	app.get('/uploads/:pic_name', function(req, res){
		res.sendFile(path.join(__dirname, '/../../uploads', req.params.pic_name));
	})

	app.get('/downloads/:pic_name', loginAuth.isLoggedIn, function(req, res){
		res.sendFile(path.join(__dirname, '/../../downloads', req.params.pic_name));
	})

  app.get("/services", loginAuth.isLoggedIn, function(request, response) {
    response.render('pages/services');
  });

	app.get("/alerts", loginAuth.isLoggedIn, function(request, response) {
  response.render('pages/alerts');;
  });

	app.get("/uploadForm", function(req,res){
		res.redirect('/profile');
	})



  app.get('/logout', exports.logout = function(req, res) {
    req.logOut();
    res.redirect('/');
  });

	app.post('/put_newuser_in_db',
		passport.authenticate('local-signup'),
		function(req, res) {
			// If this function gets called, authentication was successful.
			// `req.user` contains the authenticated user.
			res.json(req.user);
		});


  app.post('/signin',
    passport.authenticate('local-signin'),
    function(req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.json(req.user);
    });

};