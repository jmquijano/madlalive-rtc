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
        GetChat: async (parent, {meetingId,offset,size}, {auth}) => {
            // if (!auth.id) {
            //     throw new AuthenticationError('You are not logged in.');
            // }
            
            try {
                // Find Specific chat
                
                const findChat = await Chat.findAndCountAll({
                    where: {
                        meeting: meetingId
                    },
                    offset:offset || 0,
                    limit:size,
                    order:[
                        ['createdAt','DESC']
                    ]
                })
               
                if (findChat) {
                    // getChatMessages(findChat.rows)
                    return findChat.rows
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

            // TO reset when frontend logic is done

            try {
                const chat = await Chat.create({peer:peerId, meeting:meetingId, message:input});
                
                const allChat= await Chat.findAndCountAll({
                    where:{
                        meeting:meetingId
                    },
                    offset:0,
                    limit:3,
                    order:[
                        ['createdAt','DESC']
                    ]
                })
                getChatMessages(chat)
                
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