import { Body, Controller, Patch, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signUp.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { SignInDto } from './dto/signIn.dto';
import { ModifyPasswordDto } from './dto/modifyPassword.dto';
import { requireLogin } from 'src/utils/decorators/requireLogin';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.userService.signUp(signUpDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.userService.sendVerifyCodeEmail(verifyEmailDto);
  }

  @Post(['sign-in', 'admin/sign-in'])
  async signIn(@Body() signInDto: SignInDto) {
    return this.userService.signIn(signInDto);
  }

  @Patch(['password', 'admin/password'])
  @requireLogin()
  async modifyPassword(
    @Req() request: Request,
    @Body() modifyPasswordDto: ModifyPasswordDto,
  ) {
    return this.userService.modifyPassword(modifyPasswordDto);
  }
}
