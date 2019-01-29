import { ForbiddenError } from 'apollo-server-core';
import bcrypt from 'bcryptjs';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { User } from '../../entity/User';
import { ApolloContext } from '../../types/ApolloContext';

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req }: ApolloContext
  ): Promise<User> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new ForbiddenError(
        'Something went wrong. Please check your credentials.'
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new ForbiddenError(
        'Something went wrong. Please check your credentials.'
      );
    }

    if (!user.confirmed) {
      throw new ForbiddenError(
        'Your email is not confirmed yet. Please check your email.'
      );
    }

    req.session!.userId = user.id;

    return user;
  }
}
