import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import jwtDecode from 'jwt-decode';
import { Follow } from 'src/follow/entities/follow.entity';

@Injectable()
export class UsersService {
  //Repository 실제 객체는 module.ts에서 넣어준다.
  constructor(
    //controller와 entities 사이를 Repository가 이어준다.
    //Test 할 때 Repository만 바꿔주면 testDB에 쿼리를 날릴 수 있어서 편리하다.
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    private configservice: ConfigService,
  ) {}

  async findOne(userId: string) {
    const user = await this.usersRepository.findOne({
      userId: userId,
    });
    if (!user) {
      throw new HttpException(
        {
          statusCode: 404,
          message: '유저 정보가 없습니다',
          error: 'USER-001',
          data: userId,
        },
        404,
      ); //throw는 return 기능까지 수행한다.
    }

    return await this.usersRepository.findOne({ userId: userId });
  }
  // login정보 확인 logic
  async checkLoginData(loginData: LoginUserDto): Promise<boolean> {
    if (!loginData.userId) {
      throw new HttpException(
        {
          statusCode: 400,
          message: '입력 아이디 없음',
          error: 'INPUT-001',
          data: loginData,
        },
        400,
      );
    }
    if (!loginData.userPassword) {
      throw new HttpException(
        {
          statusCode: 400,
          message: '입력 비밀번호 없음',
          error: 'INPUT-002',
          data: loginData,
        },
        400,
      );
    }
    const user = await this.usersRepository.findOne({
      userId: loginData.userId,
    });

    if (!user) {
      throw new HttpException(
        {
          statusCode: 404,
          message: '유저 정보 없음',
          error: 'USER-001',
          data: loginData,
        },
        404,
      ); //throw는 return 기능까지 수행한다.
    }

    const isMatch = await bcrypt.compare(
      loginData.userPassword,
      user.userPassword,
    );
    if (isMatch) {
      return true;
    } else {
      throw new HttpException(
        {
          statusCode: 404,
          message: '비밀번호 틀림',
          error: 'USER-002',
          data: loginData,
        },
        404,
      );
    }
  }
  // 회원가입 logic
  async register(userData: CreateUserDto) {
    if (!userData.userId) {
      throw new HttpException(
        {
          statusCode: 400,
          message: '입력 아이디 없음',
          error: 'INPUT-001',
          data: userData,
        },
        400,
      );
    }

    if (!userData.userPassword) {
      throw new HttpException(
        {
          statusCode: 400,
          message: '입력 비밀번호 없음',
          error: 'INPUT-002',
          data: userData,
        },
        400,
      );
    }

    if (!userData.userName) {
      throw new HttpException(
        {
          statusCode: 400,
          message: '입력 유저네임(닉네임) 없음',
          error: 'INPUT-003',
          data: userData,
        },
        400,
      );
    }

    const user = await this.usersRepository.findOne({
      userId: userData.userId,
    });

    const userName = await this.usersRepository.findOne({
      userName: userData.userName,
    });

    if (user) {
      throw new HttpException(
        {
          statusCode: 409,
          message: '유저아이디 중복',
          error: 'USER-003',
          data: userData,
        },
        409,
      ); //throw는 return 기능까지 수행한다.
    }

    if (userName) {
      throw new HttpException(
        {
          statusCode: 409,
          message: '유저네임(닉네임) 중복',
          error: 'USER-004',
          data: userData,
        },
        409,
      ); //throw는 return 기능까지 수행한다.
    }

    const hashedPassword = await bcrypt.hash(
      userData.userPassword,
      this.configservice.get('bcryptConstant.saltOrRounds'),
    );

    userData.userPassword = hashedPassword;
    await this.usersRepository.save(userData);
  }
  // 회원 삭제 logic
  async deleteUser(deleteData: LoginUserDto) {
    const isMatch = await this.checkLoginData(deleteData);
    if (isMatch) {
      return await this.usersRepository.delete({ userId: deleteData.userId });
    } else {
      throw new HttpException(
        {
          statusCode: 404,
          message: '비밀번호 틀림(삭제 불가)',
          error: 'USER-002',
          data: deleteData,
        },
        404,
      );
    }
  }
  // 회원 정보 갱신 logic
  async updateUser(userId: string, updateData: UpdateUserDto) {
    if (!userId) {
      throw new HttpException(
        {
          statusCode: 400,
          message: '입력 아이디 없음',
          error: 'INPUT-001',
          data: { userId: userId, updateData: updateData },
        },
        400,
      );
    }

    const user = await this.usersRepository.findOne({
      userId: userId,
    });

    if (!user) {
      throw new HttpException(
        {
          statusCode: 404,
          message: '유저 정보 없음',
          error: 'USER-001',
          data: { userId: userId, updateData: updateData },
        },
        404,
      ); //throw는 return 기능까지 수행한다.
    }

    if (updateData.userName) {
      const userName = await this.usersRepository.findOne({
        userName: updateData.userName,
      });
      if (userName) {
        throw new HttpException(
          {
            statusCode: 409,
            message: '유저네임 중복',
            error: 'USER-003',
            data: { userId: userId, updateData: updateData },
          },
          409,
        );
      }
    }

    if (updateData.userPassword) {
      const hashedPassword = await bcrypt.hash(
        updateData.userPassword,
        this.configservice.get('bcryptConstant.saltOrRounds'),
      );
      updateData.userPassword = hashedPassword;
    }
    this.usersRepository.update(userId, updateData);
  }

  //login시 updateLogic
  async updateLoginAt(userId: string) {
    const user = await this.usersRepository.findOne({ userId: userId });
    if (!user)
      throw new HttpException(
        {
          statusCode: 404,
          message: '유저 정보 없음',
          error: 'USER-001',
          data: userId,
        },
        404,
      );
    else {
      user.loginAt = new Date();
      await this.usersRepository.update(user.userId, user);
    }
  }

  async findTokenId(req: any) {
    const header = req.headers.authorization;
    if (header !== undefined) {
      const validToken = header.split(' ');
      if (validToken[1] !== 'undefined') {
        try {
          const token = jwtDecode(header);
          return token['userId'];
        } catch (err) {
          throw new HttpException(
            {
              statusCode: 404,
              message: '토큰 정보 없음',
              error: 'TOKEN-001',
            },
            404,
          );
        }
      } else {
        return 'no-data';
      }
    } else {
      return 'no-data';
    }
  }

  async searchUserOnLogin(tokenId: string, userId: string) {
    const loginUser = await this.usersRepository.findOne(tokenId);
    if (loginUser.userId !== tokenId)
      throw new HttpException(
        {
          statusCode: 404,
          message: '유저 정보 없음',
          error: 'USER-001',
          data: { tokenId: tokenId, userId: userId },
        },
        404,
      );
    const users = await this.usersRepository
      .createQueryBuilder('u')
      .select([
        'u.userId AS userId',
        'u.userName AS userName',
        'u.userPhotoURL AS userPhotoURL',
        'u.userIntro AS userIntro',
        'u.isPro AS isPro',
      ])
      .where('u.userName like :name AND u.userName NOT IN(:userName)', {
        name: `%${userId}%`,
        userName: tokenId,
      })
      .getRawMany();
    const usersData = await Promise.all(
      users.map(async (user) => {
        const isFollow = await this.isFollow(tokenId, user.userId);
        return Object.assign(user, {
          relation: { isFollow: isFollow },
        });
      }),
    );
    return usersData;
  }

  async searchUser(userId: string) {
    const users = await this.usersRepository
      .createQueryBuilder('u')
      .select([
        'u.userId AS userId',
        'u.userName AS userName',
        'u.userPhotoURL AS userPhotoURL',
        'u.userIntro AS userIntro',
        'u.isPro AS isPro',
      ])
      .where('u.userName like :name', {
        name: `%${userId}%`,
      })
      .getRawMany();
    const usersData = await Promise.all(
      users.map(async (user) => {
        return Object.assign(user, {
          relation: { isFollow: false },
        });
      }),
    );
    return usersData;
  }

  async isFollow(userId: string, followingId: string) {
    const validFollow = await this.followRepository.findOne({
      userId: userId,
      followingId: followingId,
    });
    if (validFollow) return true;
    else return false;
  }
}
