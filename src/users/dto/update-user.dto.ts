import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
//nullable json 허용을 위한 picktype, omitType이 아닌 직접 작성?
export class UpdateUserDto extends OmitType(User, [
  'userId',
  'userRole',
  'loginAt',
  'following',
  'user',
  'videos',
  'followerCount',
]) {}
