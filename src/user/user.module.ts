import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';
import { Role } from './entity/role.entity';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { EmailModule } from 'src/email/email.module';
import { RoleRepository } from './repository/role.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, RoleRepository],
  exports: [RoleRepository],
  imports: [TypeOrmModule.forFeature([User, Role, Permission]), EmailModule],
})
export class UserModule {}
