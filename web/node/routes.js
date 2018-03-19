"use strict";
const passport = require("passport");
const validator = require("validator");
const ObjectId = require("mongoose").Types.ObjectId;
const User = require("./mongoose-models").User;
const Image = require("./mongoose-models").Image;
const check = require("./checks.js");
const formatDate = require("./format-date.js");
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

module.exports = (app) => {

    app.all("*", (req, res, next) => {
        if (req.user) {
            res.locals.loggedIn = true;
            res.locals.username = req.user.username;
            res.locals.displayname = req.user.displayname;
            res.locals.email = req.user.email;
            res.locals.userID = req.user._id;
            res.locals.bio = req.user.bio;
            res.locals.profilePictureURL = req.user.profilePictureURL;
        }
        else {
            res.locals.loggedIn = false;
        }
        next();
    });

    function render(res, variables, file, callback) {
        app.render(file, variables, (err, html) => {
            if (err) {
                callback(err);
            } else {
                variables.pageHTML = html;
                res.render("template", variables);
            }
        });
    }
    function get(path, pugFileLoggedIn, pugFileLoggedOut, variables = {}) {
        // "path", "pugFileLoggedIn", "pugFileLoggedOut", optionalvariables
        // "path", "pugFile", optionalvariables
        if (typeof pugFileLoggedOut != "string") {
            variables = pugFileLoggedOut;
            pugFileLoggedOut = pugFileLoggedIn;
        }

        let variablesFunction;
        if (typeof variables == "function") {
            variablesFunction = variables;
        } else {
            variablesFunction = (req, res, callback) => {
                callback(variables);
            }
        }
        app.get(path, (req, res) => {
            variablesFunction(req, res, (variables = {}) => {
                variables.loggedIn = res.locals.loggedIn;
                if (res.locals.loggedIn) {
                    variables.user = req.user;
                }
                let finalPugFileLoggedIn = pugFileLoggedIn;
                let finalPugFileLoggedOut = pugFileLoggedOut;
                if (variables.err404) {
                    finalPugFileLoggedIn = "404";
                    finalPugFileLoggedOut = "404";
                } else if (variables.err) {
                    finalPugFileLoggedIn = "err";
                    finalPugFileLoggedOut = "err";
                }

                if (res.locals.loggedIn) {
                    variables.page = finalPugFileLoggedIn;
                    render(res, variables, "logged-in/"+finalPugFileLoggedIn, (err) => {
                        variables.page = finalPugFileLoggedOut;
                        render(res, variables, "logged-out/"+finalPugFileLoggedOut, (err) => {
                            logErr(72002, err);
                        });
                    });
                } else {
                    variables.page = finalPugFileLoggedOut;
                    render(res, variables, "logged-out/"+finalPugFileLoggedOut, (err) => {
                        res.redirect(`/login?redirect=${path}`);
                        logErr(72003, err);
                    });
                }
            });

        });
    }

    app.post("/login", (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        let errors = [];

        function sendResponse() {
            res.json({
                errors: errors,
                redirect: req.query.redirect || "/",
            });
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
            passport.authenticate("local", (err, user, info) => {
                if (err) errors.push("unknown 6");
                if (errors.length != 0) return sendResponse();

                if (!user) {
                    if (info) errors.push(info);
                    if (errors.length != 0) return sendResponse();
                } else {
                    req.login(user, (err) => {
                        if (err) errors.push("unknown 7");
                        sendResponse();
                    });
                }
            })(req, res);

        });


    });

    app.post("/register", (req, res) => {
        let displayname = req.body.displayname;
        let username = req.body.username.toLowerCase();
        let email = req.body.email;
        let password = req.body.password;
        let errors = [];

        if      (validator.isEmpty(displayname))                    errors.push("displayname empty");
        else if (!validator.isLength(displayname, {max: 30}))       errors.push("displayname length");

        const usernameRegex = new RegExp(/^[a-z0-9]+$/g);
        if      (validator.isEmpty(username))                       errors.push("username empty");
        else if (!username.match(usernameRegex))                    errors.push("username chars");
        else if (!validator.isLength(username, {max: 30}))          errors.push("username length");

        if      (validator.isEmpty(password))                       errors.push("password empty");
        else if (!validator.isLength(password, {min: 6, max: 100})) errors.push("password length");

        if      (validator.isEmpty(email))                          errors.push("email empty");
        else if (!validator.isEmail(email))                         errors.push("email invalid");
        else if (!validator.isLength(email, {max: 60}))             errors.push("email length");

        function sendResponse() {
            res.json({
                errors: errors,
            });
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

    app.post("/getUsersImages", (req, res) => {
        const errors = [];
        Image.aggregate([
            {
                $match: {
                    userID: ObjectId(req.body.userID),
                },
            },
            {
                $sort: {
                    date: -1,
                },
            },
            {
                $skip: req.body.skip,
            },
            {
                $addFields: {
                    likeCount: {
                        $size: "$likes",
                    },
                    likedByUser: {
                        $in: [ObjectId(res.locals.userID), "$likes.userID"]
                    },
                }
            }
        ]).exec((err, resultImages) => {
            Image.populate(resultImages, {path: "userID"}, (err, resultImages) => {
                console.log(err);
                console.log(resultImages);
                res.json({
                    errors: errors,
                    images: resultImages,
                });
            });
        });
    });

    app.post("/like-toggle", (req, res) => {
        const errors = [];
        Image.findOne({
            fileID: req.body.fileID,
        }).select({
            likes: {
                $elemMatch: {
                    userID: res.locals.userID,
                }
            }
        }).exec((err, result) => {
            if (err) {
                errors.push(err);
                res.json({errors: errors});
            } else {
                let updatedDocument = {};
                const likesObject = {
                    likes: {
                        userID: res.locals.userID,
                    }
                };
                if (result.likes.length == 1) { // like exists
                    updatedDocument.$pull = likesObject;
                } else { // like does not exist
                    updatedDocument.$push = likesObject;
                }
                Image.findOneAndUpdate({
                    fileID: req.body.fileID,
                }, updatedDocument, (err, resultImage) => {
                    console.log(err);
                    console.log(resultImage);
                    res.json({
                        errors: errors,
                        liked: (result.likes.length != 1),
                    });
                });
            }
        });
    });

    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });

    // logged out
    get("/login", "login");
    get("/register", "register");
    get("/", "home");
    get("/u/:username", "user", (req, res, callback) => {
        check.ifUsernameExists(req.params.username).then((user) => {
            if (user) {
                user.formattedDate = formatDate(user.dateCreated, "MMMM Dth, YYYY");
                callback({
                    userPage: user,
                });
            } else {
                callback({
                    err404: true,
                });
            }
        }).catch((err) => {
            callback({
                err: err,
            });
        });
    });
    get("/i/:image", "image");

    // logged in
    get("/upload", "upload");
    get("/settings", "settings");

}
