const { gql } = require('apollo-server-express');
const { typeDefs } = require('graphql-scalars');
const users = require('./users');
const token = require('./token');
const meeting = require('./meeting');

const linkTypedefs = gql`
    type Query {
        _: Boolean
    }
    type Mutation {
        _: Boolean
    }

`;

module.exports = [linkTypedefs, typeDefs, users, token, meeting];