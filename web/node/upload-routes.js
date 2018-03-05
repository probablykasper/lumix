"use strict";

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
        file.filename = b32();
        let extension;
        if      (file.mimetype == "image/jpeg") extension = ".jpg";
        else if (file.mimetype == "image/png") extension = ".png";
        else res.err = "wrongExt";
        callback(null, file.filename+extension);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 30*1000*1000
    }
});

module.exports = (app) => {

    app.post("/upload", (req, res) => {
        if (res.locals.loggedIn) {
            let errors = [];
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

            });
        }
    });

}
