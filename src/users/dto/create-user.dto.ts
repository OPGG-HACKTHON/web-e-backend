import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
export class CreateUserDto extends PickType(User, [
  'userId',
  'userName',
  'userPassword',
  'userEmail',
  'userFeed',
  'lolTier',
  'pubgTier',
  'watchTier',
] as const) {}
