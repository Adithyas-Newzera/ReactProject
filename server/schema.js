const {gql} = require('apollo-server');
const typeDefs = gql`
    type user {
        userID: String!
        userName: String
        userLocation: String
        dpRoute: String
    }
    type Query {
        getUserByID(userID: String): user
    }
    type Mutation {
        changeDP(userID: String, dpRoute: String): user
    }
`;

module.exports = typeDefs;
