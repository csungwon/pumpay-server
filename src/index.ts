import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import express from 'express';
import session from 'express-session';
import 'reflect-metadata';
import { formatArgumentValidationError } from 'type-graphql';
import { createConnection } from 'typeorm';
import { createSchema } from './modules/schema';
import { redis } from './redis';

const main = async () => {
  const app = express();
  const RedisStore = connectRedis(session);
  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: 'qid',
      secret: process.env.SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7
      }
    })
  );

  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    formatError: formatArgumentValidationError,
    context: ({ req, res }: any) => ({ req, res })
  });

  apolloServer.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: 'http://localhost:3000'
    }
  });

  app.listen(4000, async () => {
    await createConnection();
    console.log(`🚀 server running at http://localhost:4000/graphql`);
  });
};

main();
