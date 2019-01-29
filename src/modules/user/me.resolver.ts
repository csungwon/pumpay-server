import { Ctx, Query, Resolver } from 'type-graphql';
import { User } from '../../entity/User';
import { ApolloContext } from '../../types/ApolloContext';

@Resolver()
export class MeResolver {
  @Query(() => User)
  async me(@Ctx() context: ApolloContext): Promise<User | null> {
    const userId = context.req.session!.userId;
    if (!userId) {
      return null;
    }

    return (await User.findOne(userId)) || null;
  }
}
