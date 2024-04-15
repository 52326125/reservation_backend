import { DataSource, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByUsername(username: string) {
    return await this.findOneBy([{ username }]);
  }

  async findByEmail(email: string) {
    return await this.findOneBy([{ email }]);
  }
}
