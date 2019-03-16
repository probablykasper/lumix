const { buildSchema } = require("graphql");

const schema = buildSchema(`

    "An OSO-8601 encoded UTC date string."
    scalar Date
    "Any date accepted by JavaScript."
    scalar DateInput
    "A JSON Web Token."
    scalar JWT

    type Query {
        user(userId: ID, username: String): User
        image(imageId: ID!): Image
        loggedIn: Boolean
        viewer: User
    }
    type Mutation {
        createUser(
            password: String!
            displayname: String
            username: String!
            email: String!
            bio: String
        ): User
        login(
            usernameOrEmail: String!
            password: String!
        ): JWT
        likeImage(
            imageId: String!
        ): Boolean
    }

    type UserConnection {
        list: [User]
        totalCount: Int
        # hasEarlierDates: Boolean
        firstDate: Date
        lastDate: Date
        # hasLaterDates: Boolean
    }

    type User {
        userId: ID
        displayname: String
        username: String
        email: String
        profilePictureURL: String
        bio: String
        dateCreated: String
        followersCount: Int
        followers(
            before: DateInput
            after: DateInput
            "Returns the first *n* results if positive. Returns the last *n* results if negative."
            limit: Int = 50
        ): UserConnection
        following(
            before: DateInput
            after: DateInput
            "Returns the first *n* results if positive. Returns the last *n* results if negative."
            limit: Int = 50
        ): UserConnection
        images(skip: Int, limit: Int): [Image]
    }
    type Image {
        user: User
        imageId: ID
        filename: String
        title: String
        description: String
        tags: [String]
        date: Date
        viewsCount: Int
        downloadsCount: Int
        likesCount: Int
    }
`);

module.exports = schema;
