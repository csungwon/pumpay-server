import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';

export function createSchema(): Promise<GraphQLSchema> {
  return buildSchema({
    resolvers: [__dirname + '/**/*.resolver.ts']
  });
}
