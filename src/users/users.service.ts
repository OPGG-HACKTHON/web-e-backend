import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  //Repository 실제 객체는 module.ts에서 넣어준다.
  constructor(
    //controller와 entities 사이를 Repository가 이어준다.
    //Test 할 때 Repository만 바꿔주면 testDB에 쿼리를 날릴 수 있어서 편리하다.
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(userId: string) {
    const user = await this.usersRepository.findOne({
      userId: userId,
    });
    if (!user) {
      throw new HttpException('사용자가 존재하지 않습니다.', 401); //throw는 return 기능까지 수행한다.
    }

    return await this.usersRepository.findOne(
      { userId: userId },
      { select: ['userId', 'userPhoto', 'userEmail'] },
    );
  }

  async register(userData: CreateUserDto) {
    if (!userData.userId) {
      throw new HttpException('아이디가 없습니다.', 400);
      //에러를 뿜었을 때 catch 해줄 수 있는 존재가 필요함.
      //1. interceptor 2. Exception filter
    }

    if (!userData.userEmail) {
      throw new HttpException('이메일이 없습니다.', 400);
    }

    if (!userData.userPassword) {
      throw new HttpException('비밀번호가 없습니다.', 400);
    }

    const user = await this.usersRepository.findOne({
      userId: userData.userId,
    });
    if (user) {
      throw new HttpException('이미 존재하는 사용자입니다.', 401); //throw는 return 기능까지 수행한다.
    }

    // const hashedPassword = await bcrypt.hash(userData.userPassword, 10);
    await this.usersRepository.save({
      //usersRepository.save가 DB에 저장시키는거
      userId: userData.userId,
      userPassword: userData.userPassword,
      userEmail: userData.userEmail,
    });
  }
}
