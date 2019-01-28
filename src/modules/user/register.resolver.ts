import { Arg, Mutation, Resolver } from 'type-graphql';
import { User } from '../../entity/User';
import { RegisterInput } from './register/registerInput';

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(@Arg('input') input: RegisterInput): Promise<User> {
    return await User.create(input).save();
  }
}
