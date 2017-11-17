var express = require('express');
var router = express.Router();

router.get('/bulletinboard', function(req,res) {
	res.render('bulletinboard');
})