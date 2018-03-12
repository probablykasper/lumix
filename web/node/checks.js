const User = require("./mongoose-models").User;
const check = {};
module.exports = check;

check.ifUsernameExists = (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, resultUser) => {
            if (err) reject("unknown 8");
            else if (resultUser) resolve(resultUser);
            else resolve(false);
        });
    });
}

check.ifEmailExists = (email) => {
    return new Promise((resolve, reject) => {
        User.findOne({email: email}, (err, resultUser) => {
            if (err) reject("unknown 9");
            else if (resultUser) resolve(true);
            else resolve(false);
        });
    });
}
