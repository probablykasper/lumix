const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type Query {
        user(userId: String, username: String): User
        image(imageId: String!): Image
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
        user: User
        filename: String
        title: String
        description: String
        tags: [String]
        date: String
        views: Int
        viewed: Int
        downloads: Int
        downloaded: Int
        likes: Int
        liked: Int
    }
`);

module.exports = schema;
