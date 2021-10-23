const { gql } = require('apollo-server-express');


module.exports = gql`
     type Attachments{
        id: Int!
    }

    type Message{
        body:String!
        replyTo: Int
        attachments:Attachments
    }

    type Chat {
        id: Int!
        peer: Int!
        meeting: Int!
        message: Message!
        createdAt: Date!
    }

    type Subscription  {
        chat(meetingId:Int!): Chat!
    }

    input MessageInput {
        body:String!
        replyTo: Int
        attachments:Int
      }
    type ChatPagination {
        chat:[Chat]!
    }  

    extend type Query {
        GetChat(meetingId:Int!,offset:Int!,size:Int!):[Chat]!
    }
    extend type Mutation {
        CreateChat(peerId:Int!,meetingId:Int!,input:MessageInput):Chat!
    }
`;