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
                return Date.now();
    followers: {
        type: Number,
        default: 0,
    },
});

const imageSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    imageId: String,
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
    viewed: {
        type: Number,
        default: 0,
    },
    downloads: {
        type: Number,
        default: 0,
    },
    downloaded: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
    liked: {
        type: Number,
        default: 0,
    },
});

const likeSchema = new Schema({
    imageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    date: {
        type: Date,
        default: () => {
            return Date.now();
        },
    },
});

module.exports = {
    User: mongoose.model("User", userSchema),
    Image: mongoose.model("Image", imageSchema),
    Like: mongoose.model("Like", likeSchema),
};
