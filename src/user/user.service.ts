import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { compare, hash } from 'bcrypt';
import { UserRepository } from './repository/user.repository';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { RedisService } from 'src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn.dto';
import { ModifyPasswordDto } from './dto/modifyPassword.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private emailService: EmailService,
    private redisService: RedisService,
    private jwtService: JwtService,
  ) {}

  async bcryptPassword(password: string) {
    return await hash(password, 10);
  }

  async verifyEmail(email: string, verify_code: string) {
    const redisKey = `verify_${email}`;
    const redisVerifyCode = await this.redisService.get(redisKey);

    if (!redisVerifyCode || redisVerifyCode !== verify_code) {
      throw new BadRequestException('Verify code error');
    }
    await this.redisService.delete(redisKey);
  }

  async signIn(signInDto: SignInDto) {
    const foundUser = await this.userRepo.findByUsername(signInDto.username);

    if (
      !foundUser ||
      !(await compare(signInDto.password, foundUser.password))
    ) {
      throw new BadRequestException('Invalid username or password');
    }

    const refreshToken = this.jwtService.sign(
      { username: foundUser.username, roles: foundUser.roles },
      { expiresIn: '30d' },
    );
    const accessToken = this.jwtService.sign(
      { username: foundUser.username, roles: foundUser.roles },
      { expiresIn: '1h' },
    );

    return {
      refreshToken,
      accessToken,
    };
  }

  async signUp(signUpDto: SignUpDto) {
    if (signUpDto.password !== signUpDto.password_confirm) {
      throw new BadRequestException('password confirm error');
    }

    const foundUser = await this.userRepo.findByUsername(signUpDto.username);

    if (foundUser) {
      throw new BadRequestException('username already exists');
    }

    await this.verifyEmail(signUpDto.email, signUpDto.verify_code);

    const bcryptPassword = await this.bcryptPassword(signUpDto.password);
    const user = this.userRepo.create({
      ...signUpDto,
      password: bcryptPassword,
    });
    this.userRepo.save(user);

    return await this.signIn({
      username: signUpDto.username,
      password: signUpDto.password,
    });
  }

  async sendVerifyCodeEmail(verifyEmailDto: VerifyEmailDto) {
    const { email } = verifyEmailDto;
    const redisKey = `verify_${email}`;
    const livedVerifyCode = await this.redisService.get(redisKey);

    if (livedVerifyCode) {
      throw new BadRequestException('verify code still alive');
    }

    const verifyCode = Math.random().toString().slice(2, 8);
    await this.redisService.set(redisKey, verifyCode, 5 * 60);
    this.emailService.sendSignUpVerify(email, verifyCode);
  }

  async modifyPassword(modifyPasswordDto: ModifyPasswordDto) {
    const foundUser = await this.userRepo.findByEmail(modifyPasswordDto.email);
    if (!foundUser) {
      throw new BadRequestException('email not found');
    }

    await this.verifyEmail(
      modifyPasswordDto.email,
      modifyPasswordDto.verify_code,
    );

    const bcryptPassword = await this.bcryptPassword(
      modifyPasswordDto.password,
    );
    foundUser.password = bcryptPassword;
    this.userRepo.save(foundUser);
  }
}
