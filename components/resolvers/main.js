const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { ScalarNameResolver } = require('graphql-scalars');

const users = require('./users');
const token = require('./token');
const meeting = require('./meeting');
const chat = require('./chat')

module.exports = [users, token, meeting,chat];
