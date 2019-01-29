import { Arg, Mutation, Resolver } from 'type-graphql';
import { User } from '../../entity/User';
import { RegisterInput } from './register/registerInput';
import { sendEmailConfirmation } from './sendEmail';

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(@Arg('input') input: RegisterInput): Promise<User> {
    const user = await User.create(input).save();
    await sendEmailConfirmation(user);
    return user;
  }
}
