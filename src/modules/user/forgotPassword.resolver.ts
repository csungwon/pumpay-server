import { Arg, Mutation, Resolver } from 'type-graphql';
import { User } from '../../entity/User';
import { sendResetPassword } from './sendEmail';

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    await sendResetPassword(user);
    return true;
  }
}
