var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var saltRounds = 10;
var User = require('../../models/Users');
 
module.exports = (passport) => {
    passport.use(new LocalStrategy({
            usernameField: "id",
            passwordField: "password",
        }, async (id, password, done) => {
            try {
                var exUser = await User.findOne({id: id});
                if(exUser) {
                    // password = bcrypt.hashSync(password, saltRounds);
                    // var result = await bcrypt.compareSync(password, exUser.password);
                    //var result = await bcrypt.compareSync(exUser.password.hash,password.hash);
                    if(bcrypt.compareSync(password, exUser.password)) {                        
                        done(null, exUser);
                    }
                    else {
                        done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                    }
                }
                else {
                    done(null, false, { message: '가입되지 않은 회원입니다.' });
                }
            }
            catch(error) {
                console.error(error);
                done(error);
            }
        }));


};