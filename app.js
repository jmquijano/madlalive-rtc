const typedefs = require('./components/typedefs/main');
const resolvers = require('./components/resolvers/main');
const express = require('express');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');

const { makeExecutableSchema } = require('@graphql-tools/schema');
const { DateTimeResolver, DateTimeTypeDefinition } = require("graphql-scalars");


const { Server } = require('socket.io');
const { AuthenticationGatekeeper } = require('./components/helpers/gatekeeper');



const port = 4000;

const app = express();


// CORS Options
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));

async function startServer() {
    const server = new ApolloServer({
        typeDefs: typedefs, 
        resolvers: resolvers,
        context: async ({req}) => {
            if (req) {
                const auth = AuthenticationGatekeeper(req.headers.authorization);

                return {
                    auth
                }
            }
            
        }
    });

    await server.start();

    server.applyMiddleware({app, path: '/graphql'});
}

startServer();

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

app.listen(port, () => {
    console.log('Server will start at ' + port);
})