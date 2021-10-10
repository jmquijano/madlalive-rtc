const { AuthenticationError, UserInputError } = require('apollo-server-express');
const users = require('./users');
const token = require('./token');

module.exports = [users, token];
