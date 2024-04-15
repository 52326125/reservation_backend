import { IsNotEmpty, Length } from 'class-validator';

export class SignInDto {
  @Length(8, 16)
  @IsNotEmpty()
  username: string;

  @Length(8, 16)
  @IsNotEmpty()
  password: string;
}
