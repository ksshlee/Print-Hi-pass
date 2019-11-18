//로그인 정보를 확인 해줌 login 중이면 true 아니면 false 추후 권한에 쓸수 있음
//page 라우터에서 사용되는 코드들
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/page/login');
        //res.status(403).send('로그인 필요');
        
    }
};
 
exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/');
    }
};

exports.isAdmin = (req, res, next) =>{
    if(req.user.permission == 1) {
        next();
    }
    else {
        res.redirect('/')
    }
}