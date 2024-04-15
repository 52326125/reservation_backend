import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class SignUpDto {
  @Length(8, 16)
  @IsNotEmpty()
  username: string;

  @Length(8, 16)
  @IsNotEmpty()
  password: string;

  @Length(8, 16)
  @IsNotEmpty()
  password_confirm: string;

  @IsOptional()
  @Length(4, 16)
  nickname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  verify_code: string;
}
