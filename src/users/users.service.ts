import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  createUser(userData: CreateUserDto) {
    return `data is ${userData}`;
  }
}
