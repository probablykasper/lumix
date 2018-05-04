const validator = require("validator");
module.exports = {
    username: (username, callback) => {
        if      (validator.isEmpty(username))                callback(0, "The username is empty");
        else if (!username.match(/^[a-z0-9_]+$/g))            callback(1, "The username can only contain letters, numbers and _");
        else if (!validator.isLength(username, {max: 30}))   callback(2, "The username can't be over 30 characters long");
    },
    password: (password, callback) => {
        if      (validator.isEmpty(password))                callback(3, "The password is empty");
        else if (!validator.isLength(password, {min: 6}))    callback(4, "The password needs to be at least 6 characters");
        else if (!validator.isLength(password, {max: 100}))  callback(5, "The password can't be over 100 characters long");
    },
    email: (email, callback) => {
        if      (validator.isEmpty(email))                   callback(6, "We need an email");
        else if (!validator.isEmail(email))                  callback(7, "That email ain't valid");
        else if (!validator.isLength(email, {max: 60}))      callback(8, "The email can't be over 60 characters long");
    },
}
