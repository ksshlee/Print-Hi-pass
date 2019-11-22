var express = require('express');
var router = express.Router();
var User = require('../models/Users');
var { isLoggedIn, isNotLoggedIn, isAdmin} = require('./middlewares');

/* main page. */

router.get('/', function(req, res){
  res.render('home/main');
});




//admin main 페이지
router.get('/adminmain', isAdmin, async function(req,res,next){
  res.render('adminpage/index');
});



//admin 회원 목록 페이지
router.get('/admin', isAdmin,async function(req, res, next) {
  var alluser = await User.find();
  res.render('adminpage/admin', {user:req.user, alluser:alluser});
});


//admin 회원검색 페이지
router.post('/search', async function(req,res,next){
  var users = await User.find({name:req.body.search});
  console.log(users);
  if (users == null){
    req.flash('danger','검색하신 회원이 없습니다');
    var alluser = await User.find();
    return res.redirect('back');
  }
  console.log(users);
  res.render('adminpage/userresult', {users:users, user:req.user});
});


//admin 계좌정보 변경
router.get('/changeaccount', async function(req,res,next){
  res.render('adminpage/accountnumber');
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
