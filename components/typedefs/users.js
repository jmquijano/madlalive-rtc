const { gql } = require('apollo-server-express');

module.exports = gql`

    type UserProfileSchema {
        id: Int!
        username: String!
        firstName: String!
        middleName: String!
        lastName: String!
        email: String!
        birthdate: String!
    }

    type Authenticate {
        status: Boolean!
        message: String!
        token: String!
    }

    extend type Query {
        Authenticate(username: String!, password: String!): Authenticate!
        GetMyProfile: UserProfileSchema!
    }

    extend type Mutation {
        Register(firstName:String!, middleName:String!, lastName:String!, username:String!, email:String!, password:String!):Authenticate!
    }
    
`;