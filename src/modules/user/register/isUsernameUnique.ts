import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { User } from '../../../entity/User';

@ValidatorConstraint({ async: true })
export class isUsernameUniqueConstraint
  implements ValidatorConstraintInterface {
  async validate(username: string) {
    return !(await User.findOne({ where: { username } }));
  }
}

export function IsUsernameUnique(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: isUsernameUniqueConstraint
    });
  };
}
