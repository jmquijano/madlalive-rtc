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
        GetChat: async (parent, {meetingId,page,size}, {auth}) => {
            // if (!auth.id) {
            //     throw new AuthenticationError('You are not logged in.');
            // }
            
            try {
                // Find Specific chat
                
                const findChat = await Chat.findAndCountAll({
                    where: {
                        meeting: meetingId
                    },
                    offset:(page-1)*size,
                    limit:size,
                    order:[
                        ['createdAt','DESC']
                    ]
                })
                const chatCount= await Chat.count({where:{meeting:meetingId}})
                if (findChat) {
                    getChatMessages(findChat.rows)
                    return {chat:findChat.rows,pageCount:Math.ceil(chatCount / size)};
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
                getChatMessages(allChat.rows)
                
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