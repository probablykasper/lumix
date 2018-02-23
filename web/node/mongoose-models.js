const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    uploaderGoogleId: String,
    date: String,
    views: Number,
    downloads: Number,
    likes: Number,
    tags: [String],
}, { typeKey: "$Type"});

const userSchema = new Schema({
    displayName: String,
    googleId: String,
    profilePictureURL: String,
    // images: [imageSchema],
}, { typeKey: "$Type" });

module.exports = {
    User: mongoose.model("User", userSchema),
};
