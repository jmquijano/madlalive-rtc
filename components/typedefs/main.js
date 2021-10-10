const { gql } = require('apollo-server-express');
const users = require('./users');
const token = require('./token');

const linkTypedefs = gql`
    type Query {
        _: Boolean
    }
    type Mutation {
        _: Boolean
    }

`;

module.exports = [linkTypedefs, users, token];