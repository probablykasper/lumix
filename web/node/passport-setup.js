const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const LocalStrategy = require("passport-local").Strategy;
const keys = require("./keys");
const User = require("./mongoose-models").User;
const bcrypt = require("bcryptjs");

passport.serializeUser((user, done) => {
    console.log(555);
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    console.log(444);
    User.findById(id).then((resultUser) => {
        done(null, resultUser);
    });
});

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
}, (username, password, done) => {
    User.findOne({ username: username }, function(err, resultUser) {
        if (err) return done(err);
        if (!resultUser) return done(null, false, {message: "incorrect username"});
        // match password
        bcrypt.compare(password, resultUser.password, (err, isMatch) => {
            if (err) return done(err);
            if (isMatch) return done(null, resultUser);
            if (!isMatch) return done(null, false, {message: "incorrect password"});
        });

    });
}));

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

module.exports = (app, mongoose) => {
    app.use(session({
        secret: keys.passportSessionStoreSecret,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            ttl: 60*60*24*90,
            touchAfter: 60*60*24
        }),
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
}
