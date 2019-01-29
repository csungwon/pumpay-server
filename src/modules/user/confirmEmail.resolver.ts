import { Arg, Mutation, Resolver } from 'type-graphql';
import { User } from '../../entity/User';
import { redis } from '../../redis';

@Resolver()
export class ConfirmEmailResolver {
  @Mutation(() => Boolean)
  async confirmEmail(@Arg('token') token: string): Promise<boolean> {
    const userId = await redis.get(token);

    if (!userId) {
      return false;
    }

    await Promise.all([
      User.update({ id: parseInt(userId) }, { confirmed: true }),
      redis.del(token)
    ]);

    return true;
  }
}
