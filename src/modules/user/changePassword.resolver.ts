import { Arg, Mutation, Resolver } from 'type-graphql';
import { User } from '../../entity/User';
import { redis } from '../../redis';
import { ChangePasswordInput } from './changePassword/changePasswordInput';

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => Boolean)
  async changePassword(@Arg('input')
  {
    token,
    password
  }: ChangePasswordInput): Promise<boolean> {
    const userId = await redis.get(token);

    if (!userId) {
      return false;
    }

    const user = await User.findOne(userId);

    if (!user) {
      return false;
    }

    await redis.del(token);
    user.password = password;
    await user.save();

    return true;
  }
}
