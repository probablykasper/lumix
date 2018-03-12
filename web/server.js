"use strict";
const express = require("express");
const fs = require("fs");
global.dir = (dirPath) => {
    return require("path").resolve(__dirname, dirPath);
}
global.logErr = require("./node/log-err.js");
const PORT_INSECURE = process.env.PORT_INSECURE;
const PORT_SECURE = process.env.PORT_SECURE;

// http
(() => {

    const server = require("http").createServer();
    server.on("request", require("redirect-https")({
        port: PORT_SECURE,
        body: "<!-- Please use HTTPS instead. That's a \"you don't have a choice\", not a \"please\". -->"
    }));
    server.listen(PORT_INSECURE, () => {
        console.log();
    });

})();

(() => {

    const app = express();

    // load view engine
    app.set("views", dir("pug"));
    app.set("view engine", "pug");

    // static content
    app.use("/", express.static(dir("static"), { redirect: false }));
    app.use("/i/", express.static(dir("images"), { redirect: false }));
    app.use("/", express.static(dir("static/favicon"), { redirect: false }));

    const bodyParser = require("body-parser");
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    app.use(bodyParser.json({ type: "application/json" }));

    // mongoose
    const mongoose = require("mongoose");
    mongoose.connect("mongodb://db/lumix");
    const db = mongoose.connection;
    const dbSuc = "\x1b[42m[Mongoose]\x1b[0m ";
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
        console.log(dbSuc+"connected to MongoDB");
    });

    // passport
    require("./node/passport-setup.js")(app, mongoose);

    // routes
    require("./node/routes")(app);
    require("./node/upload-routes")(app);

    const httpsOptions = {
        key: fs.readFileSync(dir(`letsencrypt/etc/letsencrypt/live/${process.env.CERT_DOMAIN}/privkey.pem`)),
        cert: fs.readFileSync(dir(`letsencrypt/etc/letsencrypt/live/${process.env.CERT_DOMAIN}/cert.pem`))
    };
    require("https").createServer(httpsOptions, app).listen(PORT_SECURE, () => {
        console.log("app listening on port "+PORT_SECURE);
    });

})();
