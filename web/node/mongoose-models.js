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
    profilePictureURL: String,
    // images: [imageSchema],
    dateCreated: {
        type: Date,
        default: () => {
            return Date.now();
        },
    },
    followers: {
        type: Number,
        default: 0,
    }
});

const imageSchema = new Schema({
    userID: String,
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
    likes: {
        type: Number,
        default: 0,
    },
});

module.exports = {
    User: mongoose.model("User", userSchema),
    Image: mongoose.model("Image", imageSchema),
};
