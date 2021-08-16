import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  //Repository 실제 객체는 module.ts에서 넣어준다.
  constructor(
    //controller와 entities 사이를 Repository가 이어준다.
    //Test 할 때 Repository만 바꿔주면 testDB에 쿼리를 날릴 수 있어서 편리하다.
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configservice: ConfigService,
  ) {}

  async findOne(userId: string) {
    const user = await this.usersRepository.findOne({
      userId: userId,
    });
    if (!user) {
      throw new HttpException('사용자가 존재하지 않습니다.', 404); //throw는 return 기능까지 수행한다.
    }

    return await this.usersRepository.findOne({ userId: userId });
  }
  // login정보 확인 logic
  async checkLoginData(loginData: LoginUserDto): Promise<boolean> {
    if (!loginData.userId) {
      throw new HttpException('아이디 없음', 400);
    }
    if (!loginData.userPassword) {
      throw new HttpException('비밀번호 없음', 400);
    }
    const user = await this.usersRepository.findOne({
      userId: loginData.userId,
    });

    if (!user) {
      throw new HttpException('해당 사용자 없음', 404); //throw는 return 기능까지 수행한다.
    }

    const isMatch = await bcrypt.compare(
      loginData.userPassword,
      user.userPassword,
    );
    if (isMatch) {
      return true;
    } else {
      throw new HttpException('비밀번호 불일치 (삭제불가)', 400);
    }
  }
  // 회원가입 logic
  async register(userData: CreateUserDto) {
    if (!userData.userId) {
      throw new HttpException('아이디가 없습니다.', 400);
    }

    if (!userData.userEmail) {
      throw new HttpException('이메일이 없습니다.', 400);
    }

    if (!userData.userPassword) {
      throw new HttpException('비밀번호가 없습니다.', 400);
    }

    if (!userData.userName) {
      throw new HttpException('유저명이 없습니다.', 400);
    }

    const user = await this.usersRepository.findOne({
      userId: userData.userId,
    });

    const userName = await this.usersRepository.findOne({
      userName: userData.userName,
    });

    if (user) {
      throw new HttpException('아이디 중복', 403); //throw는 return 기능까지 수행한다.
    }

    if (userName) {
      throw new HttpException('유저 네임(UserName) 중복', 405); //throw는 return 기능까지 수행한다.
    }

    const hashedPassword = await bcrypt.hash(
      userData.userPassword,
      this.configservice.get('bcryptConstant.saltOrRounds'),
    );
    await this.usersRepository.save({
      //usersRepository.save가 DB에 저장시키는거
      userId: userData.userId,
      userName: userData.userName,
      userPassword: hashedPassword,
      userEmail: userData.userEmail,
    });
  }
  // 회원 삭제 logic
  async deleteUser(deleteData: LoginUserDto) {
    const isMatch = await this.checkLoginData(deleteData);
    if (isMatch) {
      return await this.usersRepository.delete({ userId: deleteData.userId });
    } else {
      throw new HttpException('비밀번호 불일치 (삭제불가)', 406);
    }
  }
  // 회원 정보 갱신 logic
  async updateUser(userId: string, updateData: UpdateUserDto) {
    if (!userId) {
      throw new HttpException('아이디 없음', 400);
    }

    const user = await this.usersRepository.findOne({
      userId: userId,
    });

    if (!user) {
      throw new HttpException('해당 사용자 없음', 404); //throw는 return 기능까지 수행한다.
    } else {
      if (!updateData.userPassword) updateData.userPassword = user.userPassword;
      else {
        const hashedPassword = await bcrypt.hash(
          updateData.userPassword,
          this.configservice.get('bcryptConstant.saltOrRounds'),
        );
        updateData.userPassword = hashedPassword;
      }
      this.usersRepository.update(userId, updateData);
    }
  }

  //login시 updateLogic
  async updateLoginAt(userId: string) {
    const user = await this.usersRepository.findOne({ userId: userId });
    if (!user) throw new HttpException('해당 사용자 없음', 404);
    else {
      user.loginAt = new Date();
      await this.usersRepository.update(user.userId, user);
    }
  }
}
