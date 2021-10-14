const typedefs = require('./components/typedefs/main');
const resolvers = require('./components/resolvers/main');
const express = require('express');
const { createServer } = require("http");
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const { PubSub } = require("graphql-subscriptions");
const { execute, subscribe } = require("graphql");

const { SubscriptionServer } = require("subscriptions-transport-ws")

const { makeExecutableSchema } = require('@graphql-tools/schema');
const { DateTimeResolver, DateTimeTypeDefinition } = require("graphql-scalars");


const { Server } = require('socket.io');
const { AuthenticationGatekeeper } = require('./components/helpers/gatekeeper');


(async () => {
const PORT = 4000;

const app = express();

const httpServer = createServer(app);


// CORS Options
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));

const pubsub = new PubSub();
const server = new ApolloServer({
        typeDefs: typedefs, 
        resolvers: resolvers,
        context: async ({req}) => {
            if (req) {
                const auth = AuthenticationGatekeeper(req.headers.authorization);

                return {
                    auth,
                    pubsub
                   
                }
            }
            
        }
        
    });

 await server.start();
 const schema = makeExecutableSchema({ typeDefs:typedefs, resolvers });

  server.applyMiddleware({app, path: '/graphql'});

  SubscriptionServer.create(
    { 
        schema, execute, subscribe,
        async onConnect(connectionParams, webSocket, context) {
          console.log('Connected!')
          // console.log(connectionParams)
          // if (connectionParams.authorization) {
          //   const currentUser = await findUser(req.headers.authorization);
          //   console.log(currentUser)
          //   return { currentUser };
          // }
          // throw new Error('Missing auth token!');
        },
        async onDisconnect(webSocket, context) {
          console.log('Disconnecteds!')
        },
   },
   { server: httpServer, path: server.graphqlPath }
  );

// Socket.IO
/* const io = new Server({
    path: '/socket'
});

// Polls
io.of('/poll').on('connection', (socket) => {
    console.log('a user connected with id %s', socket.id);

    socket.on('my-message', function (data) {
        io.of('my-namespace').emit('my-message', data);
        // or socket.emit(...)
        console.log('broadcasting my-message', data);
    });
})

io.listen(3000); */

httpServer.listen(PORT, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
  });

})();