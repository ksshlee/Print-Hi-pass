var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var { isLoggedIn, isNotLoggedIn } = require('./middlewares');
var User = require('../models/Users');
 
var router = express.Router();

//회원가입 폼 검사
function validSignupForm (form){
    var id = form.id || "";
    var name = form.name || "";
    var email = form.email || "";
    var password = form.password || "";
    var confirmpassword = form.confirmpassword || "";
    
    id = id.trim();
    name = name.trim();
    email = email.trim();
    password = password.trim();
    confirmpassword = confirmpassword.trim();
  
    if( !id ){
      return "유효한 아이디를 입력하세요";
    }
  
    if( !name ){
      return "유효한 이름을 입력하세요";
    }
  
    if( !email ){
      return "유효한 이메일을 입력하세요";
    }
  
    if( !password ){
      return "유효한 비밀번호를 입력하세요";
    }
  
    if( password != confirmpassword){
      return "비밀번호가 불일치 합니다.";
    }
  
    return null;
}


//회원가입 포스트
router.post('/reg', isNotLoggedIn, async (req, res, next) => {
    // var { id, name ,email, password } = req.body;
    // try {
    //     var exUser = await User.find({ where: { id } });
    //     if(exUser) {
    //         req.flash('joinError', '이미 가입된 id입니다.');
    //         return res.redirect('/join');
    //     }
    
    //     var hash = await bcrypt.hash(password, 12);
    //     await User.create({
    //         id,
    //         name,
    //         email,
    //         password: hash,
    //     });
    //     return res.redirect('/');
    // } catch(error) {
    //     console.error(error);
    //     return next(error);
    // }

  //데이터가 잘넘어오는지 확인을 위해서
  console.log(req.body);
   //회원 가입 폼 검사하고 req.body로 넘어옴
   var err = validSignupForm(req.body , {needpw: true});
   if(err){
     // flash 설정은 나중에
     req.flash('danger', err);
     return res.redirect('/auth/reg');
   }

 // 가입된 유저인지 확인
  var user = await User.findOne({email:req.body.email});
  if(user){
    req.flash('danger', "중복된 사용자가 있습니다.");
    return res.redirect('back');
  }

 // 아이디 중복 확인
  var id = await User.findOne({id:req.body.id});
  if (id){
    req.flash('danger', "중복된 아이디가 있습니다.");
    return res.redirect('back');
  }

  // 스키마에 저장
  var user = new User({
    id : req.body.id, 
   name : req.body.name,
   email : req.body.email
 });

  // 비밀번호 hash해서 저장
  // user.password = await user.generateHash(req.body.password);
  // console.log(user);

  // user.confirmpassword = await user.generateHash(req.body.confirmpassword);
  // console.log(user);

  //다른방법
  user.password = await bcrypt.hashSync(req.body.password, saltRounds);//해시와 솔트
  console.log(user);

  user.confirmpassword = await bcrypt.hashSync(req.body.confirmpassword, saltRounds);//확인 비밀번호도 해쉬와 솔트
  console.log(user);

//  db에 저장
await user.save();

   req.flash('success', "회원 가입 성공");
   res.redirect("/");
});
 



//로그인 포스트
router.post('/log', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user){
            req.flash('loginError', info.message);
            return res.redirect('/page/login');
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            console.log("hello");
            return res.redirect('/');
        });
    })(req, res, next)  //미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
});
 
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});
 
module.exports = router;