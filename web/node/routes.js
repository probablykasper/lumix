"use strict";
const passport = require("passport");
const validator = require("validator");
const User = require("./mongoose-models").User;
const bcrypt = require("bcryptjs");

function render(app, res, pugFile, variables, callback) {
    app.render(pugFile, variables, (err, html) => {
        if (err) {
            callback(err);
        } else {
            variables.pageHTML = html;
            res.render("template", variables);
        }
    });
}

function jsonRes(res, one, two) {
    let resObj = {};
    if (one == "err") {
        resObj = {
            err: {
                code: null,
                msg: null
            }
        };
    } else if (one) {
        resObj = one;
    }
    res.json(resObj);
}

module.exports = (app) => {

    app.all("*", (req, res, next) => {
        if (req.user) {
            res.locals.loggedIn = true;
            res.locals.displayName = req.user.displayName;
            res.locals.userID = req.user._id;
            res.locals.transactions = req.transactions;
        }
        else {
            res.locals.loggedIn = false;
        }
        next();
    });

    function get(path, pugFile, variables = {}) {
        // "path", "pugFile"
        // "path", "pugFile", {variables}
        // "path", "pugFileLoggedIn", "pugFileLoggedOut"
        let loggedOutPugFile;
        if (typeof variables === "string") {
            loggedOutPugFile = variables;
            variables = {};
        } else {
            loggedOutPugFile = pugFile;
        }
        app.get(path, (req, res) => {
            function render(file, callback) {
                app.render(file, variables, (err, html) => {
                    if (err) {
                        callback(err);
                    } else {
                        variables.pageHTML = html;
                        res.render("template", variables);
                    }
                });
            }

            variables.page = pugFile;
            variables.loggedIn = res.locals.loggedIn;
            if (res.locals.loggedIn) {
                variables.displayName = req.user.displayName;
                variables.profilePictureURL = req.user.profilePictureURL;
                variables.transactions = req.user.transactions;
                render("logged-in/"+pugFile, (err) => {
                    // logErr(72001, err);
                    render("logged-out/"+loggedOutPugFile, (err) => {
                        logErr(72002, err);
                    });
                });
            } else {
                render("logged-out/"+loggedOutPugFile, (err) => {
                    logErr(72003, err);
                });
            }

        });
    }

    // app.post("/login", passport.authenticate("local", {
    //     successRedirect: "/",
    //     failureRedirect: "/login",
    //     failureFlash: false
    // }));

    app.post("/login", (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        let errors = [];

        function sendResponse() {
            if (errors.length == 0) {
                res.json({
                    errors: null,
                });
            } else {
                res.json({
                    errors: errors,
                });
            }
        }

        function checkIfUserExists(email, callback) {
            User.findOne({email: email}, (err, resultUser) => {

                if (resultUser) return callback(null, resultUser);
                if (!resultUser) {
                    User.findOne({username: email}, (err, resultUser) => {
                        if (err) return callback("unknown 9");
                        if (resultUser) return callback(null, resultUser);
                        if (!resultUser) callback("email does not exist");
                    });
                }
            });
        }

        checkIfUserExists(email, (err, resultUser) => {
            if (err) errors.push(err);
            if (errors.length != 0) return sendResponse();

            req.body.username = resultUser.username;
            console.log(req.body.username);
            passport.authenticate("local", (err, user, info) => {
                if (err) errors.push("unknown 6");
                if (errors.length != 0) return sendResponse();

                if (!user) {
                    if (info.email) errors.push(info.email);
                    if (info.password) errors.push(info.password);
                    if (errors.length != 0) return sendResponse();
                } else {
                    req.login(user, (err) => {
                        if (err) errors.push("unknown 7");
                        sendResponse();
                    });
                }
            })(req, res);

            // passport.authenticate("local", (err, user, info) => {
            //     if (err) return next(err);
            //     if (!user) return res.redirect("/login");
            //     req.logIn(user, (err) => {
            //         if (err) return next(err);
            //         return res.redirect("/users/"+user.username);
            //     });
            // })(req, res, next);

        });


    });

    app.post("/register", (req, res) => {
        let displayname = req.body.displayname;
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;
        let errors = [];

        if      (validator.isEmpty(displayname))                    errors.push("displayname empty");
        else if (!validator.isLength(displayname, {max: 30}))       errors.push("displayname length");

        const usernameRegex = new RegExp(/^[a-zA-Z0-9]+$/g);
        if      (validator.isEmpty(username))                       errors.push("username empty");
        else if (!username.match(usernameRegex))                    errors.push("username chars");
        else if (!validator.isLength(username, {max: 30}))          errors.push("username length");

        if      (validator.isEmpty(password))                       errors.push("password empty");
        else if (!validator.isLength(password, {min: 6, max: 100})) errors.push("password length");

        if      (validator.isEmpty(email))                          errors.push("email empty");
        else if (!validator.isEmail(email))                         errors.push("email invalid");
        else if (!validator.isLength(email, {max: 60}))             errors.push("email length");

        function sendResponse() {
            if (errors.length == 0) {
                res.json({
                    errors: null,
                });
            } else {
                res.json({
                    errors: errors,
                });
            }
        }

        function checkIfUserExists(email, username, callback) {
            User.findOne({email: email}, (err, resultUser) => {
                if (err) return callback("unknown 1");
                if (resultUser) return callback("email exists");
                User.findOne({username: username}, (err, resultUser) => {
                    if (err) return callback("unknown 2");
                    if (resultUser) return callback("username exists");
                    callback(null);
                });
            });
        }

        function generateHash(password, callback) {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) return callback("unknown 3");
                bcrypt.hash(password, salt, (err, hashedPassword) => {
                    if (err) return callback("unknown 4");
                    callback(null, hashedPassword);
                });
            });
        }

        function newUser(userObject, callback) {
            new User(userObject).save((err) => {
                if (err) return callback("unknown 5");
                callback(null);
            });
        }

        if (errors.length != 0) return sendResponse();
        checkIfUserExists(email, username, (err) => {
            if (err) errors.push(err);
            if (errors.length != 0) return sendResponse();

            generateHash(password, (err, hashedPassword) => {
                if (err) errors.push(err);
                if (errors.length != 0) return sendResponse();

                new User({
                    displayname: displayname,
                    username: username,
                    email: email,
                    password: hashedPassword,
                }).save((err) => {
                    if (err) errors.push("unknown 5");
                    sendResponse();
                });
            });
        });

    });



    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });

    get("/login", "login");
    get("/register", "register");
    get("/", "home");

    // get("/balance", "balance");
    // get("/gains", "gains");
    //
    // get("/transactions", "transactions");

}
