var express = require('express');
var router = express.Router();
var User = require('../models/Users');
var { isLoggedIn, isNotLoggedIn } = require('./middlewares');

/* main page. */
router.get('/', async function(req, res, next) {
  var alluser = await User.find();
  res.render('home/main', {user:req.user, alluser:alluser});
});

/* manual page. */
router.get('/manual', function(req,res,next){
  res.render('home/manual');
});


//delete
router.get('/delete:id', isLoggedIn, async function(req, res, next){
  console.log('hi');
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/');
});


module.exports = router;
