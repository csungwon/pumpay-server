import fs from 'fs';
import hbs from 'handlebars';
import nodemailer, { SendMailOptions } from 'nodemailer';
import { v4 } from 'uuid';
import { User } from '../../entity/User';
import { redis } from '../../redis';
import { EmailTemplateVariables } from '../../types/EmailTemplateVariables';
import { SendEmailOptions } from '../../types/SendEmailOptions';

async function registerToken(userId: number): Promise<string> {
  const token = v4();
  await redis.set(token, userId, 'ex', 60 * 60 * 24);
  return token;
}

function buildEmail(
  path: string,
  user: User,
  callbackUrl: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        reject('Cannot read the file.');
      }

      const template = hbs.compile(data);
      const variables: EmailTemplateVariables = {
        email: user.email,
        username: user.firstName,
        callbackUrl
      };

      resolve(template(variables));
    });
  });
}

async function sendEmail({
  subject,
  receiver,
  callbackUrl,
  emailTemplatePath
}: SendEmailOptions) {
  const token = registerToken(receiver.id);
  const html = buildEmail(
    emailTemplatePath,
    receiver,
    callbackUrl + '/' + (await token)
  );

  const {
    user,
    pass,
    smtp: { host, secure, port }
  } = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });

  const mailOptions: SendMailOptions = {
    from: 'Pumpay <donotreply@pumpay.com>',
    to: receiver.email,
    subject,
    html: await html
  };

  const info = await transporter.sendMail(mailOptions);

  console.log(`Messae sent: ${info.messageId}`);
  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}

export async function sendEmailConfirmation(user: User) {
  await sendEmail({
    receiver: user,
    subject: 'Confirm your email address',
    callbackUrl: 'http://localhost:3000/auth/confirm-email',
    emailTemplatePath: __dirname + '/emailTemplates/emailConfirmation.hbs'
  });
}

export async function sendResetPassword(user: User) {
  await sendEmail({
    receiver: user,
    subject: 'Reset your password',
    callbackUrl: 'htpp://localhost:3000/auth/reset-password',
    emailTemplatePath: __dirname + '/emailTemplates/resetPassword.hbs'
  });
}
