const { AuthenticationError, UserInputError, ValidationError } = require('apollo-server-express');
const { Chat } = require('../database/models');


const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

function getChatMessages(chat){
    pubsub.publish('GET_CHAT_MESSAGES' , { chat })
    // setTimeout(getAllUsers(users), 5000);
}

module.exports = {
    Query: {
        GetChat: async (parent, {meetingId}, {auth}) => {
            // if (!auth.id) {
            //     throw new AuthenticationError('You are not logged in.');
            // }
            
            try {
                // Find Specific chat
                
                let findChat = await Chat.findAll({
                    where: {
                        meeting: meetingId
                    }
                })
                if (findChat) {
                    getChatMessages(findChat)
                    return findChat;
                } else {
                    
                    
                }
            } catch (e) {
                throw new ValidationError(e);
            }
            
        }
    },
    Mutation:{
        CreateChat: async (parent, {peerId, meetingId, input},{auth}) => {
             // if (!auth.id) {
            //     throw new AuthenticationError('You are not logged in.');
            // }

            try {
                const chat = await Chat.create({peer:peerId, meeting:meetingId, message:input});
                
                const allChat= await Chat.findAll({
                    where:{
                        meeting:meetingId
                    }
                })
                getChatMessages(allChat)
                
                return chat
            } catch (e) {
                // Server Error
                throw new UserInputError(e);
            }

        },
    },
    Subscription: {
        chat: {
            subscribe: () => pubsub.asyncIterator(["GET_CHAT_MESSAGES"]),
        },
      },
}