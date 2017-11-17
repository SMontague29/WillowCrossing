//makes sure user is signed in
var isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
  //	console.log(req);
    return next();
  }

  res.redirect('/');
}

module.exports = {isLoggedIn: isLoggedIn};
