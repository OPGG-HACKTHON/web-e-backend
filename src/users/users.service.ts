import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      ID: '1',
      name: 'john',
      password: 'changeme',
    },
    {
      ID: '2',
      name: 'maria',
      password: 'guess',
    },
  ];

  async findOne(ID: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.ID === ID);
    return user;
  }

  register(userData: CreateUserDto) {
    return {
      ID: userData.ID,
      name: userData.name,
      password: userData.password,
    };
  }
}
