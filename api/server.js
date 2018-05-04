const express = require("express");
const expressGQL = require("express-graphql");
const jwt = require("jsonwebtoken");
const keys = require("./node/keys");

const app = express();

app.use(async (req, res) => {
    req.userId = null;
    req.loggedIn = false;
    const token = req.headers.authentication;
    try {
        if (token) {
            const {userId} = await jwt.verify(token, keys.jsonWebTokenSecret)
            req.userId = userId;
            req.loggedIn = true;
        }
    } catch(err) {
        console.log(err);
    }
    req.next();
});

app.use("/graphql", expressGQL((req, res) => ({
    schema: require("./node/gql-schema"),
    rootValue: require("./node/gql-resolvers"),
    context: {
        userId: req.userId,
        loggedIn: req.loggedIn,
    },
    graphiql: true,
    formatError: error => {
        if (typeof error.message == "object") {
            return {
                message: error.message.message,
                errors: error.message,
                locations: error.locations,
                path: error.path,
            }
        }
        return {
            message: error.message,
            locations: error.locations,
            path: error.path,
        }
    },
    // formatError: error => ({
    //     message: error.message,
    //     locations: error.locations,
    //     path: error.path,
    // })
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
