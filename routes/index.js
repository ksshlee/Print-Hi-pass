var express = require('express');
var router = express.Router();
var User = require('../models/Users');
var { isLoggedIn, isNotLoggedIn, isAdmin} = require('./middlewares');

/* main page. */

router.get('/', function(req, res){
  res.render('home/main');
});



//admin 페이지
router.get('/admin', isAdmin,async function(req, res, next) {
  var alluser = await User.find();
  res.render('home/admin', {user:req.user, alluser:alluser});
});


//회원검색
router.post('/search', async function(req,res,next){
  console.log('hi')
  var users = await User.find({name:req.body.search});
  console.log(users);
  if (users == null){
    req.flash('danger','검색하신 회원이 없습니다');
    var alluser = await User.find();
    return res.redirect('back');
  }
  console.log(users);
  res.render('home/userresult', {users:users, user:req.user});
});


/* manual page. */
router.get('/manual', function(req,res,next){
  res.render('home/manual');
});


//delete
router.get('/delete:id', isLoggedIn, async function(req, res, next){
  console.log('hi');
  await User.findByIdAndDelete(req.params.id);
  res.redirect('back');
});


module.exports = router;
