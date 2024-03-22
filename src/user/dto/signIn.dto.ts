import { Length } from 'class-validator';

export class SignInDto {
  @Length(8, 16)
  username: string;

  @Length(8, 16)
  password: string;
}
