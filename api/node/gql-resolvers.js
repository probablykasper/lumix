const db = require("./mongoose-models");
const ObjectId = require("mongoose").Types.ObjectId;

class User {
    constructor({userId, username}) {
        this.userDoc = new Promise((resolve, reject) => {
            let query = {};
            if (userId) {
                if (userId.length != 24) return reject("The userId must be 24 characters long");
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
    images({skip, limit}) {
        return new Images({
            userId: "5ab6aa70cd70d6008ed0d46a",
        })
        // .then((docs) => {
        //     console.log(docs);
        //     return docs;
        // }, (err) => {
        //     return err;
        // });
    }
}

class Images {
    constructor({userId}) {
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
    imageId() {
        return this.imageDoc.then(({imageId}) => (imageId));
    }
    user() {
        return this.imageDoc.then(({userId}) => {
            return new User({
                userId: userId.toString(),
            });
        });
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
    date() {
        return this.imageDoc.then(({date}) => (date));
    }
    views() {
        return this.imageDoc.then(({views}) => (views));
    }
    viewed() {
        return this.imageDoc.then(({viewed}) => (viewed));
    }
    downloads() {
        return this.imageDoc.then(({downloads}) => (downloads));
    }
    downloaded() {
        return this.imageDoc.then(({downloaded}) => (downloaded));
    }
    likes() {
        return this.imageDoc.then(({likes}) => (likes));
    }
    liked() {
        return this.imageDoc.then(({liked}) => (liked));
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
