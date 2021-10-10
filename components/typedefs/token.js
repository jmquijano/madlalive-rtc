const { gql } = require('apollo-server-express');

module.exports = gql`
    type TokenPayload {
        id: Int!
        username: String!
        displayName: String!
        iat: Int!
        exp: Int!
    }

    extend type Query {
        GetTokenInfo: TokenPayload!
    }
`;