var express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
var logauthenticate = false;
var router = express.Router();
 
router.get('/profile', isLoggedIn, (req, res) => {//middlewares 에서 isAuthenticated가 true 면 render/// false면 다시 로그인창
    res.render('profile', { title: '내 정보', user: req.user });
});
 
router.get('/join', isNotLoggedIn, (req, res) => {//회원가입은 로그인하지 않은 사람만 볼 수 있다 그러므로 isNotLogged isAuthenticated가 false일때 render
    res.render('register/register', {
        title: '회원가입',
        user: req.user,
        joinError: req.flash('joinError'),
    });
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('register/login');
})
 
module.exports = router;

