import React, { useEffect } from 'react'

const Chatlist = ({data,subscribeToMoreMessage,onLoadMore}) => {
    useEffect(() => {
        subscribeToMoreMessage()
    }, [])
    return (
        <>  
            <button onClick={()=>onLoadMore()}>
                Fetch More
            </button>
            {data?.GetChat.slice(0).reverse().map(i=>(
              <p key={i.id}>{i.message.body}</p>
          ))} 
        </>
    )
}

export default Chatlist
