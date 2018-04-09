const db = require("./mongoose-models");
const ObjectId = require("mongoose").Types.ObjectId;
const parseDate = require("./parse-date");

class UserConnectionFollow {
    constructor(userConnectionType, {userId, before, after, limit}) {
        this.userId = userId;
        this.userConnectionType = userConnectionType;
        this.followDocs = new Promise((resolve, reject) => {
            let query = {
                endDate: null,
            }
            if (this.userConnectionType == "followers") {
                query.followedUserId = userId;
            } else if (this.userConnectionType == "following") {
                query.userId = userId;
            }

            if (before || after) query.date = {};
            if (before) {
                before = parseDate(before, errCode => {
                    reject(`Date "before" formatted incorrectly`);
                });
                if (before) query.date.$lt = before;
            }
            if (after) {
                after = parseDate(before, errCode => {
                    reject(`Date "after" formatted incorrectly`);
                });
                if (after) query.date.$gt = after;
            }

            query = db.Follow.find(query);
            if (limit > 0) query.sort({date:  1});
            else           query.sort({date: -1});
            query.limit(limit);
            query.exec().then((docs) => {
                if (docs) {
                    resolve(docs);
                } else {
                    reject("Unknown error returning users");
                }
            }, (err) => {
                reject();
            });

        });
    }
    list() {
        return this.followDocs.then(docs => {
            let users = [];
            for (let i = 0; i < docs.length; i++) {
                let user;
                if (this.userConnectionType == "followers") {
                    user = docs[i].userId;
                } else if (this.userConnectionType == "following") {
                    user = docs[i].followedUserId;
                }
                users[i] = new User({
                    userId: user,
                });
            }
            return users;
        });
    }
    totalCount() {
        return this.followDocs.then(docs => {
            return docs.length;
        });
    }
    firstDate() {
        return this.followDocs.then(docs => {
            const doc = docs[0];
            if (doc) return docs[0].date;
            else     return null;
        });
    }
    lastDate() {
        return this.followDocs.then(docs => {
            const doc = docs[docs.length-1];
            if (doc) return docs[docs.length-1].date;
            else     return null;
        });
    }
}

class User {
    constructor({userId, username}) {
        this.userDoc = new Promise((resolve, reject) => {
            let query = {};
            if (userId) {
                if (String(userId).length != 24) return reject("The userId must be 24 characters long");
                query._id = ObjectId(userId);
            } else if (username) {
                query.username = username;
            } else {
                return reject("The user field requires at least a userId or username argument");
            }
            db.User.findOne(query).exec().then((doc) => {
                if (doc) {
                    resolve(doc);
                } else {
                    reject("The user does not exist");
                }
            }, (err) => {
                reject();
            });
        });
    }
    userId() {
        return this.userDoc.then(({_id}) => (_id));
    }
    displayname() {
        return this.userDoc.then(({displayname}) => (displayname));
    }
    username() {
        return this.userDoc.then(({username}) => (username));
    }
    email() {
        return this.userDoc.then(({email}) => (email));
    }
    profilePictureURL() {
        return this.userDoc.then(({profilePictureURL}) => (profilePictureURL));
    }
    bio() {
        return this.userDoc.then(({bio}) => (bio));
    }
    dateCreated() {
        return this.userDoc.then(({dateCreated}) => (dateCreated));
    }
    followersCount() {
        return this.userDoc.then(({followers}) => (followers));
    }
    followers(args) {
        return this.userDoc.then(({_id}) => {
            args.userId = _id;
            return new UserConnectionFollow("followers", args);
        });
    }
    following(args) {
        return this.userDoc.then(({_id}) => {
            args.userId = _id;
            return new UserConnectionFollow("following", args);
        });
    }
    images({skip, limit}) {
        return new Images({
            userId: "5ab6aa70cd70d6008ed0d46a",
        });
    }
}
// KH   5ab6aa70cd70d6008ed0d46a
// xvx  5ac94ef5c3fd2800075ccb59
// xx   5ac94f2cc3fd2800075ccb5d
// new db.Follow({
//     followedUserId: "5ab6aa70cd70d6008ed0d46a", // KH
//     userId: "5ac94ef5c3fd2800075ccb59", // xvx
// }).save();
// new db.Follow({
//     followedUserId: "5ab6aa70cd70d6008ed0d46a", // KH
//     userId: "5ac94f2cc3fd2800075ccb5d", // xx
// }).save();
// new db.Follow({
//     followedUserId: "5ac94ef5c3fd2800075ccb59", // xvx
//     userId: "5ab6aa70cd70d6008ed0d46a", // KH
// }).save();
// new db.Follow({
//     followedUserId: "5ac94f2cc3fd2800075ccb5d", // xx
//     userId: "5ab6aa70cd70d6008ed0d46a", // KH
// }).save();

class Images {
    constructor({userId, skip, limit}) {
        return new Promise((resolve, reject) => {
            let query = {};
            if (userId) {
                if (userId.length != 24) return reject("The userId must be 24 characters long");
                query.userId = ObjectId(userId);
            }
            db.Image.find(query).exec().then((docs) => {
                let images = [];
                for (let i = 0; i < docs.length; i++) {
                    images[i] = new Image({
                        doc: docs[i],
                    });
                }
                resolve(images);
            }, (err) => {
                reject();
            });
        });
    }
}

class Image {
    constructor({doc, imageId}) {
        this.imageDoc = new Promise((resolve, reject) => {
            if (doc) {
                resolve(doc);
            } else {
                const query = {
                    imageId: imageId,
                }
                db.Image.findOne(query).exec().then((doc) => {
                    resolve(doc);
                }, (err) => {
                    reject();
                });
            }
        });
    }
    user() {
        return this.imageDoc.then(({userId}) => {
            return new User({
                userId: userId.toString(),
            });
        });
    }
    imageId() {
        return this.imageDoc.then(({imageId}) => (imageId));
    }
    filename() {
        return this.imageDoc.then(({filename}) => (filename));
    }
    title() {
        return this.imageDoc.then(({title}) => (title));
    }
    description() {
        return this.imageDoc.then(({description}) => (description));
    }
    tags() {
        return this.imageDoc.then(({tags}) => (tags));
    }
    date() {
        return this.imageDoc.then(({date}) => (date));
    }
    viewsCount() {
        return this.imageDoc.then(({views}) => (views));
    }
    downloadsCount() {
        return this.imageDoc.then(({downloads}) => (downloads));
    }
    likesCount() {
        return this.imageDoc.then(({likes}) => (likes));
    }
}

const root = {
    user: (args) => {
        return new User(args);
    },
    image: (args) => {
        return new Image(args);
    }
}

module.exports = root;
