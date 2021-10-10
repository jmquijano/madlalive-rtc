const { AuthenticationError, UserInputError, ValidationError } = require('apollo-server-express');
const { Users } = require('../database/models');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
    Query: {
        GetTokenInfo: async (parent, {}, {auth}) => {
            if (!auth.id) {
                throw new AuthenticationError('You are not logged in.');
            }

            return auth;
        }
    }
}