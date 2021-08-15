import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateFollowDto } from './dto/create-follow.dto';
import { Follow } from './entities/follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createFollow(followData: CreateFollowDto) {
    const user = await this.userRepository.findOne(followData.userId);
    const following = await this.userRepository.findOne(followData.followingId);
    if (!user) throw new HttpException('사용자가 없습니다', 404);
    if (!following) throw new HttpException('팔로우할 사용자가 없습니다', 404);
    if (user.userId === following.userId)
      throw new HttpException('나자신을 팔로우 할 수 없습니다', 405);

    const already = await this.alreadyFollow(followData);
    if (already) {
      throw new HttpException('이미 팔로우한 사용자입니다', 406);
    } else {
      await this.followRepository.save({
        userId: user.userId,
        followingId: following.userId,
      });

      user.followerCount = user.followerCount + 1;
      await this.userRepository.save(user);

      return {
        statusCode: 201,
        message: '팔로잉 성공',
        data: { userId: user.userId, followingId: following.userId },
      };
    }
  }
  //이미 팔로우했는지 확인
  async alreadyFollow(followData: CreateFollowDto): Promise<boolean> {
    const follow = await this.followRepository.findAndCount({
      where: { userId: followData.userId, followingId: followData.followingId },
    });
    if (follow[1] === 1) return true;
    else return false;
  }
  //userId 팔로잉 유저 목록, QueryBuilder로 join 후, 가져옴
  async getMyFollowers(userId: string) {
    //userId validation
    const validUser = await this.userRepository.findOne({ userId: userId });
    if (!validUser) throw new HttpException('사용자가 없습니다', 404);
    //follower logic
    const followers = await this.followRepository
      .createQueryBuilder('f')
      .innerJoin(User, 'u', 'f.userId = u.userId')
      .select([
        'u.userId AS userId',
        'u.userName AS userName',
        'u.userPhotoURL AS userPhotoURL',
        'u.userIntro AS userIntro',
      ])
      .where('f.followingId = :userId', { userId: userId })
      .getRawMany();
    return followers;
  }
  //userId 팔로잉 유저 목록, QueryBuilder로 join 후, 가져옴
  async getMyFollowings(userId: string) {
    //userId validation
    const validUser = await this.userRepository.findOne({ userId: userId });
    if (!validUser) throw new HttpException('사용자가 없습니다', 404);
    //follwingLogic
    const following = await this.followRepository
      .createQueryBuilder('f')
      .innerJoin(User, 'u', 'f.followingId = u.userId')
      .select([
        'u.userId AS userId',
        'u.userName AS userName',
        'u.userPhotoURL AS userPhotoURL',
        'u.userIntro AS userIntro',
      ])
      .where('f.userId = :userId', { userId: userId })
      .getRawMany();
    return following;
  }
  //unfollow logic
  async unfollow(followData: CreateFollowDto) {
    const user = await this.userRepository.findOne({
      userId: followData.userId,
    });
    const validFollow = await this.followRepository.findOne({
      userId: followData.userId,
      followingId: followData.followingId,
    });
    if (!validFollow) throw new HttpException('팔로우 중이 아닙니다', 404);
    else {
      await this.followRepository.delete({
        userId: validFollow.userId,
        followingId: validFollow.followingId,
      });

      user.followerCount = user.followerCount - 1;
      return await this.userRepository.save(user);
    }
  }
  //get new Followers
  async getNewFollowers(userId: string) {
    //userId validation
    const validUser = await this.userRepository.findOne({ userId: userId });
    if (!validUser) throw new HttpException('사용자가 없습니다', 404);
    else {
      //follwing Alarm Logic
      return await this.followRepository
        .createQueryBuilder('f')
        .innerJoin(User, 'u', 'f.userId = u.userId')
        .select([
          'u.userId AS userId',
          'u.userName AS userName',
          'u.userPhotoURL AS userPhotoURL',
          'u.userIntro AS userIntro',
        ])
        .where('f.followingId = :userId AND :loginAt <= f.createdAt', {
          userId: userId,
          loginAt: validUser.loginAt,
        })
        .getRawMany();
    }
  }
  //유효한 follow인지 확인
  async isFollow(followData: CreateFollowDto) {
    const validFollow = await this.followRepository.findOne({
      userId: followData.userId,
      followingId: followData.followingId,
    });
    if (validFollow) return true;
    else return false;
  }
}
