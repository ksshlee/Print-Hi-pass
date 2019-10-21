var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var session = require('express-session');
var mongoose = require('mongoose');//몽구스 db
var flash = require('connect-flash');// 로그인 및 회원가입
var bodyParser = require('body-parser');//
var passport = require('passport')//로그인 및 회원가입
require('dotenv').config();//로그인및 회원가입

//로그인 및 회원가입
var sequelize = require('./models/Users');
var passportConfig = require('./routes/api');


var app = express();



//sequelize.sync();//로그인 회원가입
passportConfig(passport);//로그인 회원가입
// //DB
//mongodb+srv://admin:administrator@cluster0-hecuu.mongodb.net/test?retryWrites=true&w=majority// var db = mongoose.connection;
// db.once("open", function(){
//     console.log("DB connect success");//db 연결 성공시
// });
// db.on("error", function(err){
//     console.log("DB connect failed : ",err);//db 연결 실패시
// });

//=======================================================
// mongodb connect
//=======================================================
mongoose.Promise = global.Promise; // ES6 Native Promise를 mongoose에서 사용한다.
const connStr = 'mongodb://localhost/print_pro';
mongoose.connect(connStr, {useNewUrlParser: true,useUnifiedTopology:true });
mongoose.connection.on('error', console.error);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// session을 사용
app.use(session({
  name: 'ph-1',
  resave: true,
  saveUninitialized: true,
  secret: 'long-longlonglong123asdasdaszxcasdq1123123sdasdlkjlkjaflkvna;ls123'
}));


//로그인 및 회원가입
//app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());
//파일 업로드
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.static(path.join(__dirname, 'uploads')));


app.use(flash()); // flash message를 사용할 수 있도록
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;  // passport는 req.user로 user정보 전달
  res.locals.flashMessages = req.flash();
  next();
});



//route
//route 위치 중요
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var docsRouter = require('./routes/docs');//게시판
var pageRouter = require('./routes/page');//로그인 및 회원가입
var authRouter = require('./routes/auth');//로그인 회원가입



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/docs', docsRouter);//게시판 
app.use('/page', pageRouter);//로그인 및 회원가입
app.use('/auth', authRouter);//로그인 및 회원가입



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;