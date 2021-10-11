const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { ScalarNameResolver } = require('graphql-scalars');

const users = require('./users');
const token = require('./token');
const meeting = require('./meeting');

module.exports = [users, token, meeting];
