import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { compare, hash } from 'bcrypt';
import { UserRepository } from './repository/user.repository';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { RedisService } from 'src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn.dto';

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

  async signIn(signInDto: SignInDto) {
    const foundUser = await this.userRepo.findByUsername(signInDto.username);
    const bcryptPassword = await this.bcryptPassword(signInDto.password);

    if (!foundUser || (await compare(bcryptPassword, foundUser.password))) {
      throw new BadRequestException('Invalid username or password');
    }

    const refreshToken = this.jwtService.sign(
      { username: foundUser.username },
      { expiresIn: '30d' },
    );
    const accessToken = this.jwtService.sign(
      { username: foundUser.username },
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

    const redisVerifyCode = await this.redisService.get(
      `sign_up_verify_${signUpDto.email}`,
    );

    if (!redisVerifyCode || redisVerifyCode !== signUpDto.verify_code) {
      throw new BadRequestException('Verify code error');
    }

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
    const redisKey = `sign_up_verify_${email}`;
    const livedVerifyCode = await this.redisService.get(redisKey);

    if (livedVerifyCode) {
      throw new BadRequestException('verify code still alive');
    }

    const verifyCode = Math.random().toString().slice(2, 8);
    await this.redisService.set(redisKey, verifyCode, 5 * 60);
    this.emailService.sendSignUpVerify(email, verifyCode);
  }
}
