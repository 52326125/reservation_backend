import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EMAIL_TOKEN } from 'src/const/token';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Module({
  providers: [
    EmailService,
    {
      provide: EMAIL_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Resend(configService.get('RESEND_API_KEY'));
      },
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
