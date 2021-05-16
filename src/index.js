const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Vote = require('./resolvers/Vote')
const Subscription = require('./resolvers/Subscription')

const { PubSub } = require('apollo-server')

const pubsub = new PubSub()
// 2
const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Vote,
    Link
  }

// 3

const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient()
const { getUserId } = require('./utils');

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
      path.join(__dirname, 'schema.graphql'),
      'utf8'
    ),
    resolvers,
    context: ({ req }) => {
      return {
        ...req,
        prisma,
        pubsub,
        userId:
          req && req.headers.authorization
            ? getUserId(req)
            : null
      };
    }
  });

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );