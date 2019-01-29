import { Ctx, Mutation, Resolver } from 'type-graphql';
import { ApolloContext } from '../../types/ApolloContext';

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() context: ApolloContext) {
    return new Promise((resolve, reject) => {
      context.req.session!.destroy(err => {
        if (err) {
          console.log(err);
          reject(false);
        }
        context.res.clearCookie('qid');
        return resolve(true);
      });
    });
  }
}
