import React from 'react'

import {gql, useQuery,useMutation} from '@apollo/client';
import Template from '../partials/template';

import {useParams} from "react-router-dom";

import Chatlist from './Chatlist';

export const GQL_GetChat = gql`
query Query($meetingId: Int!, $offset: Int!, $size: Int!) {
  GetChat(meetingId: $meetingId, offset: $offset, size: $size) {
    id
    peer
    meeting
    message {
      body
    }
    createdAt
  }
}
`;
export const GQL_MakeChat = gql`
mutation Mutation($peerId: Int!, $meetingId: Int!, $input: MessageInput) {
    CreateChat(peerId: $peerId, meetingId: $meetingId, input: $input) {
      id
      peer
      meeting
      message {
        body
      }
      createdAt
    }
  }
`;


export const GQL_ChatSubscription = gql`
subscription Subscription($meetingId: Int!) {
  chat(meetingId: $meetingId) {
    id
    peer
    meeting
    message {
      body
    }
    createdAt
  }
}
`;

const Chat = () => {
    const {meetingId}=useParams()

    const [message, setMessage] = React.useState();
    
    const {data,subscribeToMore,fetchMore} = useQuery(GQL_GetChat, { 
        variables:{
            meetingId:parseInt(meetingId),
            offset:0,
            size:5
        },
        onCompleted: data => {
             if(data){
                //  console.log(data)
             }
        },
        onError: () => {
           
        },
        fetchPolicy:"cache-and-network"
    })
    const [makeChat,{ loading,error }] = useMutation(GQL_MakeChat,{ errorPolicy: 'all',
       onCompleted:data =>{
           if(data){
               console.log(data)
           }
       }
});
    const handleSubmit =async (e) =>{
       e.preventDefault()
      await makeChat({variables:{peerId: 1, meetingId: parseInt(meetingId), input: {"body":message}}})

    }

  
    return (
        <>
        <Template pageTitle={'Chat'} selectedMenuIndex={'2'} />
           
        <h1>Chat Room {meetingId}</h1>

          <Chatlist 
          data={data} 
          subscribeToMoreMessage= {()=>
            subscribeToMore({
              document: GQL_ChatSubscription,
              variables: { meetingId: parseInt(meetingId) },
              updateQuery: (prev, { subscriptionData }) => {
               if (!subscriptionData.data) return prev; 
                const newFeedItem = subscriptionData.data.chat;
                return Object.assign({}, prev, {
                  GetChat: [newFeedItem, ...prev.GetChat],
                });
              }
            })
          } 
          onLoadMore={() =>
            fetchMore({
              variables: {
                meetingId:parseInt(meetingId),
                offset: data?.GetChat.length,
                size:3
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                console.log(prev)
                console.log(fetchMoreResult)
                if (!fetchMoreResult) return prev;
                return Object.assign({}, prev, {
                  GetChat: [...prev.GetChat, ...fetchMoreResult.GetChat]
                });
              }
            })
          }
          />
         
              
          <form onSubmit={handleSubmit}>
              <input type="text" onChange={(e)=>setMessage(e.target.value)}/>
              <button type="submit">
                    Send
              </button>
          </form>
            
        </>
    )
}

export default Chat
