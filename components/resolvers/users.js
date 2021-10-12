const { AuthenticationError, UserInputError, ValidationError } = require('apollo-server-express');
const { Users } = require('../database/models');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Mutation } = require('./meeting');



function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function createJWT(payload, expire = "3h") {
    const expiration = expire;
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: expiration
    });
}

module.exports = {
    Query: {
        Authenticate: async (parent, {username, password}) => {
            let status = false;
            let message = "";
            let token = "";
            
            try {
                // Find User
                let findUser = await Users.findOne({
                    where: {
                        username: username
                    }
                })

                // Find the User
                if (findUser) {
                    // Compare password
                    const matchPassword = bcrypt.compareSync(password, findUser.password);
                    if (matchPassword) {
                        // Correct Password
                        const tokenPayload = {
                            id: findUser.id,
                            username: findUser.username,
                            displayName: findUser.firstName + (isBlank(findUser.middleName) ? '' : '' + findUser.middleName) + (isBlank(findUser.lastName) ? '' : ' ' + findUser.lastName)
                        };

                        status = true;
                        message = "Authentication was successful.";
                        token = createJWT(tokenPayload, "3h");
                    } else {
                        // Incorrect Password
                        message = "The user's password is not valid.";
                        throw new UserInputError(message);
                    }

                    
                    
                } else {
                    // User not found
                    message = "The user couldn't be found."
                    throw new UserInputError(message);
                }
                
            } catch (e) {
                // Server Error
                throw new UserInputError(message);
            }

            return {
                status: status,
                message: message,
                token: token
            };
        },
        GetMyProfile: async(parent, {}, {auth}) => {
            if (!auth.id) {
                throw new AuthenticationError('You are not logged in.');
            }

            let status = false;
            let message = "";

            try {
                // Find User
                let findUser = await Users.findOne({
                    where: {
                        id: auth.id
                    }
                })

                if (findUser) {
                    return findUser;
                } else {
                    throw new ValidationError('User was not found or may have been deleted.');
                }
            } catch (e) {

            }

            

        } 

    },
    Mutation:{
        Register: async (parent, {firstName, middleName, lastName, username, email, password}) => {
            let status = false;
            let message = "";
            let token = "";
            
            try {
                // Check Username
                let existingUsername = await Users.findOne({
                    where: {
                        username: username
                    }
                })
                 // Check Email
                let existingEmail = await Users.findOne({
                    where: {
                        email: email
                    }
                })


                // If user/email alraedy exists
                if(existingUsername){
                    message='Username already exists'
                    throw new UserInputError(message);
                } 
                if(existingEmail){
                    message='Email already exists'
                    throw new UserInputError(message);
                } 

                const hashedPassword=await bcrypt.hash(password,12)
                const user = await Users.create({firstName, middleName, lastName, username, email, password:hashedPassword });
                const tokenPayload = {
                     id: user.id,
                     username:user.username,
                     displayName:user.firstName + (isBlank(user.middleName) ? '' : '' + user.middleName) + (isBlank(user.lastName) ? '' : ' ' + user.lastName) 
                };
                status = true;
                message = "Registration was successful.";
                token = createJWT(tokenPayload, "3h");
                
            } catch (e) {
                // Server Error
                throw new UserInputError(message);
            }

            return {
                status: status,
                message: message,
                token: token
            };
        },
    }
}