const express = require("express");
const expressGQL = require("express-graphql");
const jwt = require("jsonwebtoken");
const keys = require("./node/keys");

const app = express();

app.use((req, res) => {
    const token = req.headers.authentication;
    if (token) {
        jwt.verify(token, keys.jsonWebTokenSecret, (err, jwtData) => {
            if (err) {
                req.userId = null;
                req.loggedIn = false;
            } else {
                req.userId = jwtData.userId;
                req.loggedIn = true;
            }
            req.next();
        });
    }
});

app.use("/graphql", expressGQL((req, res) => ({
    schema: require("./node/gql-schema"),
    rootValue: require("./node/gql-resolvers"),
    context: {
        userId: req.userId,
        loggedIn: req.loggedIn,
    },
    graphiql: true,
    formatError: require("./node/errors"),
    // formatError: (error) => {
    //     console.log(error);
    // }
    // formatError: (error) => {
    //     let code;
    //     if (Array.isArray(error.message)) {
    //         code = error.message[0];
    //     } else {
    //         code = error.message;
    //     }
    //     const code = error.message;
    //     const message = require("./node/errors").getMessage(error);
    //     return {
    //         message: message,
    //         code: code,
    //         locations: error.locations,
    //         path: error.path,
    //     }
    // },
})));

// mongoose
let retryTime;
if (process.env.APP_ENV == "production") {
    retryTime = process.env.PROD_RETRY_TIME || 5000;
} else {
    retryTime = process.env.DEV_RETRY_TIME || 1000;
}
const dbSuc = "\x1b[42m[Mongoose]\x1b[0m ";
const dbErr = "\x1b[101m[Mongoose]\x1b[0m ";
const gqlSuc = "\x1b[42m[GraphQL]\x1b[0m ";

const mongoose = require("mongoose");
function mongooseConnect() {
    mongoose.connect("mongodb://db/lumix").then(() => {
        console.log(dbSuc, "Connected to MongoDB");
    }).catch(err => {
        console.log(dbErr, `Could not connect to MongoDB. Retrying in ${retryTime/1000}s...`);
            setTimeout(() => {
                mongooseConnect();
            }, retryTime);
    });
}
mongooseConnect();

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        console.log("Mongoose successfully disconnected");
        process.exit(0);
    });
});

app.listen(4000, () => {
    console.log(gqlSuc, "Started GQL API server");
});
