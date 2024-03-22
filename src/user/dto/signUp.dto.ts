import { IsEmail, Length } from 'class-validator';

export class SignUpDto {
  @Length(8, 16)
  username: string;

  @Length(8, 16)
  password: string;

  @Length(8, 16)
  password_confirm: string;

  @Length(4, 16)
  nickname: string;

  @IsEmail()
  email: string;

  verify_code: string;
}
