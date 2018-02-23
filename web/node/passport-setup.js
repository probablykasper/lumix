const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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

passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({googleId: profile.id}).then((resultUser) => {
        if (resultUser) {
            // user alreaady exists
            console.log(`login: ${resultUser.googleId} ${resultUser.displayName}`);
            done(null, resultUser);
        } else {
            // new user
            new User({
                displayName: profile.displayName,
                googleId: profile.id,
                profilePictureURL: profile.photos[0].value
            }).save().then((newUser) => {
                console.log(`newlogin: ${newUser.googleId} ${newUser.displayName}`);
                done(null, newUser);
            });
        }
    });
}));
