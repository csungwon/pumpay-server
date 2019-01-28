import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { formatArgumentValidationError } from 'type-graphql';
import { createConnection } from 'typeorm';
import { createSchema } from './modules/schema';

const main = async () => {
  const app = express();
  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    formatError: formatArgumentValidationError
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, async () => {
    await createConnection();
    console.log(`🚀 server running at http://localhost:4000/graphql`);
  });
};

main();
