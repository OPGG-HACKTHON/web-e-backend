import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(ID: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(ID);
    if (user && user.password === password) {
      // const { ...result, password } = user; //구조분해
      console.log('error');
      return user;
    }
    return null;
  }

  async login(loginData: LoginUserDto): Promise<any> {
    const payload = { loginData };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
