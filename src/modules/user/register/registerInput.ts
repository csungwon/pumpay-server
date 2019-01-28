import { IsAlphanumeric, IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { IsEmailUnique } from './isEmailUnique';
import { IsUsernameUnique } from './isUsernameUnique';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  @IsEmailUnique({
    message: `$property '$value' alreday exists. Use another $property.`
  })
  email: string;

  @Field()
  @Length(8, 25)
  password: string;

  @Field()
  @Length(6, 40)
  @IsAlphanumeric()
  @IsUsernameUnique({
    message: `$property '$value' already exists. Use another $property`
  })
  username: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
