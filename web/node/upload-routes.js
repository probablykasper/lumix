"use strict";
const multiparty = require("multiparty");

module.exports = (app) => {

    app.post("/uploads", (req, res) => {
        const form = new multiparty.Form();

        form.parse(req, (err, fields, files) => {
            let partIndex = fields.qqpartindex;
            // text/plain is required to ensure support for IE9 and older
            res.set("Content-Type", "text/plain");
            if (partIndex == null) {
                onSimpleUpload(fields, files[fileInputName][0], res);
            } else {
                onChunkedUpload(fields, files[fileInputName][0], res);
            }
        });

    });
    
}
