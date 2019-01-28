import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { User } from '../../../entity/User';

@ValidatorConstraint({ async: true })
export class isEmailUniqueConstraint implements ValidatorConstraintInterface {
  async validate(email: string) {
    return !(await User.findOne({ where: { email } }));
  }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: isEmailUniqueConstraint
    });
  };
}
