const db = require("./mongoose-models");
const ObjectId = require("mongoose").Types.ObjectId;

class User {
    constructor({userId, username}) {
        this.userDoc = new Promise((resolve, reject) => {
            let query = {};
            if (userId) {
                query._id = userId;
            } else if (username) {
                query.username = username;
            } else {
                reject("The user field requires at least a userId or username argument");
            }
            db.User.findOne(query).exec().then((doc) => {
                resolve(doc);
            });
        });
        // return this.user;
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
    images({skip, limit}) {
        this.userId().then((userId) => {
            return new Images({
                userId: userId,
            });
        })
        // return new Promise((resolve, reject) => {
        //     this.userId().then((userId) => {
        //         db.Image.aggregate([
        //             {
        //                 $match: {
        //                     userID: ObjectId(userId),
        //                 },
        //             },
        //             {
        //                 $sort: {
        //                     date: -1,
        //                 },
        //             },
        //             {
        //                 $skip: skip,
        //             },
        //             {
        //                 $limit: limit,
        //             },
        //             {
        //                 $addFields: {
        //                     likeCount: {
        //                         $size: "$likes",
        //                     },
        //                     likedByUser: {
        //                         $in: [ObjectId(userId), "$likes.userID"]
        //                     },
        //                 }
        //             }
        //         ]).exec((err, resultImages) => {
        //             console.log(resultImages);
        //             db.Image.populate(resultImages, {path: "userID"}, (err, resultImages) => {
        //                 console.log(err);
        //                 console.log(resultImages);
        //                 resolve(resultImages);
        //             });
        //         });
        //     });
        // });
    }
}

class Images {
    constructor({userId}) {
        console.log(`img ${userId}`);
    }
}

const root = {
    user: (args) => {
        return new User(args);
    }
}

module.exports = root;
