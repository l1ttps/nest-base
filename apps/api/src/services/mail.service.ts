import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { loadTemplate } from '../helper/loadTemplate';
import { APPLICATION_NAME } from '../common/configs/defaultConfig';
import { SendMail } from '../common/type';
@Injectable()
export class MailService {
  // template = loadTemplate('mail-template.hbs');
  // transporter: nodemailer.Transporter;
  // constructor(private configService: ConfigService) {
  //   this.transporter = nodemailer.createTransport({
  //     host: this.configService.get<string>('MAIL_SERVER_HOST'),
  //     port: this.configService.get<number>('MAIL_SERVER_PORT'),
  //     secure: true,
  //     auth: {
  //       user: this.configService.get<string>('MAIL_SERVER_USERNAME'),
  //       pass: this.configService.get<string>('MAIL_SERVER_PASSWORD'),
  //     },
  //   });
  // }
  // public async sendEmail(mail: SendMail) {
  //   try {
  //     const { subject, to, markdown, description, summary } = mail;
  //     const result = await this.transporter.sendMail({
  //       from: {
  //         address: this.configService.get<string>('MAIL_SERVER_SENDER_EMAIL'),
  //         name: APPLICATION_NAME,
  //       },
  //       subject,
  //       text: subject,
  //       to,
  //       html: this.template({
  //         description,
  //         applicationName: APPLICATION_NAME,
  //         title: subject,
  //         summary,
  //         html: markdown,
  //         currentYear: new Date().getFullYear(),
  //         footerText: `This email is sent to you from the ${APPLICATION_NAME} project`,
  //       }),
  //     });
  //     return result;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
}
