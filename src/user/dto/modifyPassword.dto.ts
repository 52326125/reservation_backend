import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class ModifyPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(8, 16)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  verify_code: string;
}
