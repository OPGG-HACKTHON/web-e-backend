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
  //팔로우 만들기
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
      return {
        statusCode: 201,
        message: '팔로잉 성공',
      };
    }
  }
  //이미 팔로우 했는지 체크
  async alreadyFollow(followData: CreateFollowDto): Promise<boolean> {
    const follow = await this.followRepository.findAndCount({
      where: [
        { userId: followData.userId },
        { followingId: followData.followingId },
      ],
    });
    if (follow[1] === 1) return true;
    else return false;
  }
}
