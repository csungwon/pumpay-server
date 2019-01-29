import { readFileSync } from 'fs';
import hbs from 'handlebars';
import nodemailer, { SendMailOptions } from 'nodemailer';
import { v4 } from 'uuid';
import { User } from '../../entity/User';
import { redis } from '../../redis';

async function sendEmail(mailOptions: SendMailOptions) {
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

  const info = await transporter.sendMail(mailOptions);

  console.log(`Messae sent: ${info.messageId}`);
  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}

export async function sendEmailConfirmation(user: User) {
  const token = v4();
  console.log(user.id);
  await redis.set(token, user.id, 'ex', 60 * 60 * 24);
  const confirmUrl = `http://localhost:3000/auth/confirm-email/${token}`;

  const emailDoc = readFileSync(
    __dirname + '/emailTemplates/emailConfirmation.hbs',
    'utf8'
  );
  const template = hbs.compile(emailDoc);

  const options: SendMailOptions = {
    from: 'Pumpay <donotreply@pumpay.com>',
    to: user.email,
    subject: 'Confirm your email address',
    html: template({
      username: user.firstName,
      email: user.email,
      confirmUrl
    })
  };

  sendEmail(options);
}
