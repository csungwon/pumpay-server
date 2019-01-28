import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';

const typeDefs = gql`
  type Query {
    """
    Hello World GraphQL Query
    """
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello Graphql'
  }
};

const main = () => {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`🚀 server running at http://localhost:4000/graphql`);
  });
};

main();
