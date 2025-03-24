import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CrudService } from '../../libs/crudService';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService extends CrudService<User> {
  constructor(@InjectRepository(User) public repo: Repository<User>) {
    super(repo);
  }

  test() {
    return this.repo.find();
  }
}
