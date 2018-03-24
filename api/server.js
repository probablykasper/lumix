const express = require("express");
const expressGQL = require("express-graphql");

const app = express();

app.use("/graphql", expressGQL({
    schema: require("./node/gql-schema"),
    rootValue: require("./node/gql-resolvers"),
    graphiql: true,
}));

// mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://db/lumix");
const db = mongoose.connection;
const dbSuc = "\x1b[42m[Mongoose]\x1b[0m ";
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(dbSuc+"connected to MongoDB");
});

app.listen(4000, () => {
    console.log("Started GQL API server");
});
