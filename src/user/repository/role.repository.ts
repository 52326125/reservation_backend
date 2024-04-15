import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Role } from '../entity/role.entity';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  async findByIds(roleIds: number[]) {
    return this.find({
      where: {
        id: In(roleIds),
      },
      relations: {
        permission: true,
      },
    });
  }
}
