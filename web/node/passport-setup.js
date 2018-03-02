const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const LocalStrategy = require("passport-local").Strategy;
const keys = require("./keys");
const User = require("./mongoose-models").User;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((resultUser) => {
        done(null, resultUser);
    });
});

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
}, (username, password, done) => {
    User.findOne({ username: username }, function(err, resultUser) {
        if (err) {
            done(err);
        } else if (!resultUser) {
            done(null, false, {
                message: "Incorrect username."
            });
        } else if (!resultUser.validPassword(password)) {
            done(null, false, {
                message: "Incorrect password."
            });
        } else {
            done(null, resultUser);
        }
    });
}));

// passport.use(new GoogleStrategy({
//     clientID: keys.google.clientID,
//     clientSecret: keys.google.clientSecret,
//     callbackURL: "/auth/google/callback"
// }, (accessToken, refreshToken, profile, done) => {
//     User.findOne({googleId: profile.id}).then((resultUser) => {
//         if (resultUser) {
//             // user alreaady exists
//             // console.log(`login: ${resultUser.googleId} ${resultUser.displayName}`);
//             done(null, resultUser);
//         } else {
//             // new user
//             new User({
//                 displayName: profile.displayName,
//                 googleId: profile.id,
//                 profilePictureURL: profile.photos[0].value
//             }).save().then((newUser) => {
//                 // console.log(`newlogin: ${newUser.googleId} ${newUser.displayName}`);
//                 done(null, newUser);
//             });
//         }
//     });
// }));


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
