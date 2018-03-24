const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type Query {
        user(userId: String, username: String): User
    }
    type User {
        userId: String
        displayname: String
        username: String
        email: String
        # password: String
        profilePictureURL: String
        bio: String
        dateCreated: String
        images(skip: Int, limit: Int): [Image]
    }
    type Image {
        imageId: String
        # user(userId: String, username: String): User
        filename: String
        title: String
        description: String
        # tags:
        date: String
        # views:
        # downloads:
        # likes:
    }
`);

module.exports = schema;
