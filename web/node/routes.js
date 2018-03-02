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

    app.post("/register", (req, res) => {
        let displayname = req.body.displayname
        let username = req.body.username
        let email = req.body.email
        let password = req.body.password
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

        if (errors.length == 0) {
            User.findOne({email: email}, (err, resultUser) => {
                if (err) errors.push("unknown");
                if (resultUser) errors.push("email exists");
                User.findOne({username: username}, (err, resultUser) => {
                    if (err) errors.push("unknown");
                    if (resultUser) errors.push("username exists");
                    if (errors.length == 0) {
                        bcrypt.genSalt(10, (err, salt) => {
                            if (err) errors.push("unknown");
                            bcrypt.hash(password, salt, (err, hashedPassword) => {
                                if (err) errors.push("unknown");
                                new User({
                                    displayname: displayname,
                                    username: username,
                                    email: email,
                                    password: password,
                                }).save((err) => {
                                    if (err) errors.push("unknown");
                                    if (errors.length == 0) {
                                        console.log("success");
                                        res.json({
                                            errors: null,
                                        });
                                    } else {
                                        res.json({
                                            errors: errors,
                                        });
                                    }
                                });
                            });
                        });
                    } else {
                        res.json({
                            errors: errors,
                        });
                    }
                });
            });
        } else {
            res.json({
                errors: errors,
            });
        }
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
