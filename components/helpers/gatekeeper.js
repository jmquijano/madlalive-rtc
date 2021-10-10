const { Users } = require('../database/models');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { AuthenticationError } = require('apollo-server-express');



module.exports.AuthenticationGatekeeper = (token) => {
    const atok = token;

    if (atok) {
        try {
            const verify = jwt.verify(atok, process.env.JWT_SECRET_KEY);

            return verify;
            
        } catch (e) {
            
            // throw new AuthenticationError('Your session has expired or invalid. Please login again.', {'message': 'INVALID_TOKEN'});
        }
    }

}