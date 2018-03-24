const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    displayname: String,
    bio: {
        type: String,
        default: "",
    },
    username: String,
    email: String,
    password: String,
    profilePictureURL: {
        type: String,
        default: "/default-pp.png",
    },
    // images: [imageSchema],
    dateCreated: {
        type: Date,
        default: () => {
            return Date.now();
        },
    },
    followers: [{
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        date: {
            type: Date,
            default: () => {
                return Date.now();
            },
        },
    }],
});

const imageSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    fileID: String,
    filename: String,
    title: String,
    description: String,
    tags: [String],

    date: {
        type: Date,
        default: () => {
            return Date.now();
        },
    },
    views: {
        type: Number,
        default: 0,
    },
    downloads: {
        type: Number,
        default: 0,
    },
    likes: [{
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        date: {
            type: Date,
            default: () => {
                return Date.now();
            },
        },
    }],
});

module.exports = {
    User: mongoose.model("User", userSchema),
    Image: mongoose.model("Image", imageSchema),
};
