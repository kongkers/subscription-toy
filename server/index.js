import { readFileSync } from 'node:fs';

import { ApolloServer } from '@apollo/server';
import morgan from 'morgan';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { createServer } from 'http';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import { createHandler } from 'graphql-sse/lib/use/express';

import express from 'express';
const pubsub = new PubSub();

const port = 4000;

// [!] DRAGONS [!] - in many cases the Apollo server implementation
// requires variables used here to be defined using the expected name
// so some variables in this script cannot be renamed at will!
//  - typeDefs must be called "typeDefs" or their implementation will explode
//  - httpServer must be called "httpServer" or their implementation will explode
//  - resolvers must be called "resolvers" or their implementation will explode
//  - schema must be called "schema" or their implementation will explode
//
// There may be others.

const typeDefs = readFileSync('schema.graphqls', 'utf8');

// we pretend we only have one user - his points are stored here
var points = 100;

// points are also in the users object within members

var members = [
  {
    number: 123456,
    points: points,
  },
];

// our users points grow at a constant rate and we publish each change
// using pubsub.

const incrementPoints = () => {
  points += 1;
  members[0].points = points;

  pubsub.publish('POINTS_CHANGED', {
    points: points,
    pointsChanged: {
      points: points,
    },
  });
  console.log('Incrementing points...');
  setTimeout(incrementPoints, 5000);
};

incrementPoints();

// points can be fetched using a query or subscribed to with the
// subscription yielding values published above

const resolvers = {
  Query: {
    membership: () => members[0],
  },
  Subscription: {
    pointsChanged: {
      subscribe: () => pubsub.asyncIterator(['POINTS_CHANGED']),
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
const handler = createHandler({ schema });

const app = express();
app.use(cors());
app.use(morgan('dev'));

app.use('/graphql/stream', async(req, res) => {
  try {
    await handler(req, res);
  } catch(err) {
    console.log(err);
    res.writeHead(500).end();
  }
});

app.listen(4000, () => {
  console.log(`Server listening on port ${port}`);
});
//const httpServer = createServer(app);

// our goal is to deliver subscriptions as multi-part http responses
// rather than websockets but I couldn't get that to work so added
// a websocket endpoint hoping it would help debug the issues

/*
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/',
});
const serverCleanup = useServer({ schema }, wsServer);
*/
/*
const server = new ApolloServer({
  typeDefs,
  resolvers,
  execute,
  subscribe,
  schema,
  introspection: true,
  cors: {
    origin: "*",
  },
});
await server.start();
app.use('/', cors(), express.json(), expressMiddleware(server));

httpServer.listen(port, () => {
  console.log(`listening on ${port}`)
})
*/
