import { User } from '../entity/User';

export interface SendEmailOptions {
  receiver: User;
  subject: string;
  callbackUrl: string;
  emailTemplatePath: string;
}
