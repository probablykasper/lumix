"use strict";
const Image = require("./mongoose-models").Image;

function b32() {
    const length = 11;
    let string = require("crypto").randomBytes(7);
    string = require("base32").encode(string);
    return string.substr(0, length);
}

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "images/");
    },
    filename: function(req, file, callback) {
        file.fileID = b32();
        let extension;
        if      (file.mimetype == "image/jpeg") extension = ".jpg";
        else if (file.mimetype == "image/png") extension = ".png";
        else res.err = "wrongExt";
        callback(null, file.fileID+extension);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 30*1000*1000
    }
});
function multerUpload(path, fileSize) {
    return multer({
        storage: multer.diskStorage({
            destination: function(req, file, callback) {
                callback(null, path);
            },
            filename: function(req, file, callback) {
                file.fileID = b32();
                let extension;
                if      (file.mimetype == "image/jpeg") extension = ".jpg";
                else if (file.mimetype == "image/png") extension = ".png";
                else res.err = "wrongExt";
                callback(null, file.fileID+extension);
            }
        }),
        limits: {
            fileSize: fileSize
        }
    });
}
const imageUpload = multerUpload("images/", 30*1000*1000);

module.exports = (app) => {

    app.post("/upload", (req, res) => {
        let errors = [];
        function sendResponse() {
            res.json({
                errors: errors,
                redirect: req.query.redirect || "/",
            });
        }

        if (res.locals.loggedIn) {
            upload.array("image", 1)(req, res, function(err) {
                if (err) {
                    // error when uploading
                    console.log("ERROR UPLOADING");
                    console.log(err);
                    return;
                }
                // success
                console.log("SUCCESS UPLOADING");
                req.files[0].filename;
                req.files[0].path;
                console.log(req.files);
                console.log(req.body);

                let title = req.body.title;
                let description = req.body.description;
                let tags = JSON.parse(req.body.tags);

                new Image({
                    userID: res.locals.userID,
                    filename: req.files[0].filename,
                    fileID: req.files[0].fileID,
                    title: title,
                    description: description,
                    tags: tags,
                }).save((err) => {
                    if (err) errors.push("unknown 5");
                    sendResponse();
                });


            });
        }
    });

}
